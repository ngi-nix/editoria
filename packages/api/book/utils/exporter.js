const cheerio = require('cheerio')
const pubsweetServer = require('pubsweet-server')
const { getPubsub } = require('pubsweet-server/src/graphql/pubsub')
const { epubArchiver } = require('./epubArchiver')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const get = require('lodash/get')
const includes = require('lodash/includes')
const crypto = require('crypto')
const waait = require('waait')
const { db } = require('@pubsweet/db-manager')
const logger = require('@pubsweet/logger')

const {
  substanceToHTML,
  cleanDataIdAttributes,
  vivliostyleDecorator,
} = require('./converters')

const { execCommand } = require('./filesystem')

const { generateContainer } = require('./htmlGenerators')

const { htmlToEPUB } = require('./htmlToEPUB')
const bookConstructor = require('./bookConstructor')
const { pagednation } = require('./pagednation')
const { icmlArchiver } = require('./icmlArchiver')
const { icmlPreparation } = require('./icmlPreparation')
const { Template } = require('editoria-data-model/src').models

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')
const {
  pubsubManager,
  jobs: { connectToJobQueue },
} = pubsweetServer

const EpubBackend = async (
  bookId,
  mode,
  templateId,
  previewer,
  fileExtension,
  icmlNotes,
  ctx,
) => {
  try {
    const jobQueue = await connectToJobQueue()
    const pubsub = await getPubsub()
    let queueJobId
    const jobId = crypto.randomBytes(3).toString('hex')
    const pubsubChannel = `EPUBCHECK.${ctx.user}.${jobId}`
    let template
    let notesType
    let templateHasEndnotes
    if (fileExtension !== 'icml') {
      template = await Template.findById(templateId)
      const { notes } = template
      notesType = notes
      templateHasEndnotes = notesType === 'endnotes'
    } else {
      notesType = icmlNotes
    }
    let resultPath

    // The produced representation of the book holds two map data types one
    // for the division and one for the book components of each division to
    // ensure the order of things
    const book = await bookConstructor(bookId, templateHasEndnotes, ctx)

    const frontDivision = book.divisions.get('front')
    const backDivision = book.divisions.get('back')

    const tocComponent = frontDivision.bookComponents.get('toc')
    tocComponent.content = generateContainer(tocComponent)

    let endnotesComponent
    if (
      templateHasEndnotes ||
      (fileExtension === 'icml' && icmlNotes === 'endnotes')
    ) {
      endnotesComponent = backDivision.bookComponents.get('endnotes')
      endnotesComponent.content = generateContainer(endnotesComponent)
    }

    book.divisions.forEach((division, divisionId) => {
      let counter = 0
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { componentType } = bookComponent
        const isTheFirstInBody = division.type === 'body' && counter === 0

        if (componentType === 'toc') return

        const container = generateContainer(bookComponent, isTheFirstInBody)

        const convertedContent = substanceToHTML(
          container,
          bookComponent,
          notesType,
          tocComponent,
          endnotesComponent,
        )
        bookComponent.content = cleanDataIdAttributes(convertedContent)
        counter += 1
      })
    })

    // Check if notes exist, else remove the book component
    if (templateHasEndnotes) {
      const $endnotes = cheerio.load(endnotesComponent.content)
      const $toc = cheerio.load(tocComponent.content)
      if ($endnotes('ol').length === 0) {
        backDivision.bookComponents.delete('endnotes')
        $toc('.toc-endnotes').remove()
        tocComponent.content = $toc('body').html()
      }
    }

    if (previewer === 'vivliostyle' || fileExtension === 'epub') {
      if (previewer === 'vivliostyle') {
        book.divisions.forEach((division, divisionId) => {
          division.bookComponents.forEach((bookComponent, bookComponentId) => {
            bookComponent.content = vivliostyleDecorator(
              bookComponent,
              book.title,
            )
          })
        })
      }
      const tempFolder = await htmlToEPUB(book, template)
      const epubFilePath = await epubArchiver(
        tempFolder,
        `${process.cwd()}/${uploadsDir}/epubs`,
      )

      // for the validator
      // const validatorPoolPath = await epubArchiver(
      //   tempFolder,
      //   `${process.cwd()}/epubcheck_data`,
      // )
      const validationResponse = new Promise((resolve, reject) => {
        pubsub.subscribe(
          pubsubChannel,
          async ({ epubcheckJob: { status } }) => {
            logger.info(pubsubChannel, status)
            if (status === 'Conversion complete') {
              await waait(1000)
              const job = await db('pgboss.job').whereRaw(
                "data->'request'->>'id' = ?",
                [queueJobId],
              )
              const { report } = job[0].data.response
              console.log('report', report)
              resolve(report)
            }
          },
        )
      })
      jobQueue
        .publish(`epubcheck`, {
          filename: path.basename(epubFilePath),
          pubsubChannel,
        })
        .then(id => (queueJobId = id))

      const validationResult = await validationResponse
      console.log('validation', validationResult)

      // await execCommand(
      //   `docker run --rm -v ${process.cwd()}/${uploadsDir}/epubs:/app/data kitforbes/epubcheck /app/data/${path.basename(
      //     epubFilePath,
      //   )}`,
      // )
      if (
        includes(
          validationResult,
          'Error while parsing file: element "ol" incomplete; missing required element "li"',
        ) ||
        includes(
          validationResult,
          'Error while parsing file: element "navMap" incomplete; missing required element "navPoint"',
        )
      ) {
        throw new Error(
          'You have to include something in the Table of Contents of the book',
        )
      }
      // await fs.remove(validatorPoolPath)
      // epubcheck here
      resultPath = epubFilePath.replace(`${process.cwd()}`, '')

      if (previewer === 'vivliostyle') {
        const vivliostyleRoot = `${process.cwd()}/${uploadsDir}/vivliostyle/`
        const destination = path.join(
          vivliostyleRoot,
          `${crypto.randomBytes(32).toString('hex')}`,
        )
        await fs.ensureDir(destination)
        await fs.copy(tempFolder, destination)
        await fs.remove(epubFilePath)
        resultPath = destination.replace(`${process.cwd()}`, '')
      }
      await fs.remove(tempFolder)

      return { path: resultPath, validationResult }

      // exec(`docker-compose run --rm epubcheck`, function(
      //   error,
      //   stdout,
      //   stderr,
      // ) {
      //   console.log('1', stdout)
      //   console.log('2', error)
      //   console.log('3', stderr)
      // })
      //to here

      // Here start the logic of html to epub
      // each book component decorate with html-body
      // each book component decorate with valid epub properties epub:type, etc
      // fix urls (imgs, stylesheet, in actual css fix the fonts path if any)
    }

    if (previewer === 'pagedjs' || fileExtension === 'pdf') {
      if (fileExtension === 'pdf') {
        const { hash } = await pagednation(book, template, true)
        const path = require('path')

        const pagedCLI = path.join(
          `${process.cwd()}/`,
          'node_modules/.bin/pagedjs-cli -i',
        )
        await fs.emptyDir(`${process.cwd()}/uploads/pdfs`)
        const pdf = path.join(`${process.cwd()}/`, `uploads/pdfs/${hash}.pdf`)
        await execCommand(
          `${pagedCLI} ${process.cwd()}/uploads/paged/${hash}/index.html -o ${pdf}`,
        )
        // pagedjs-cli
        return {
          path: pdf.replace(`${process.cwd()}`, ''),
          validationResult: undefined,
        }
      }
      const { clientPath } = await pagednation(book, template)
      return { path: clientPath, validationResult: undefined }
    }

    if (fileExtension === 'icml') {
      const { path: icmlTempFolder } = await icmlPreparation(book)
      await execCommand(
        `docker run --rm -v ${icmlTempFolder}:/data pandoc/core index.html -o index.icml`,
      )
      await fs.remove(`${icmlTempFolder}/index.html`)
      const icmlFilePath = await icmlArchiver(
        icmlTempFolder,
        `${process.cwd()}/${uploadsDir}/icmls`,
      )
      await fs.remove(icmlTempFolder)
      return {
        path: icmlFilePath.replace(`${process.cwd()}`, ''),
        validationResult: undefined,
      }
      // append to single html file each book component
      // fix url images
    }
  } catch (e) {
    console.log('e', e)
    throw new Error(e)
  }
}

module.exports = EpubBackend
