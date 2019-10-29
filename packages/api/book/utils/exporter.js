const cheerio = require('cheerio')
const pubsweetServer = require('pubsweet-server')
const { getPubsub } = require('pubsweet-server/src/graphql/pubsub')
const { epubArchiver } = require('./epubArchiver')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const get = require('lodash/get')
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
    let template
    let notesType
    let templateHasEndnotes
    const jobQueue = await connectToJobQueue()
    const pubsub = await getPubsub()

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

      // Init Job epubcheck

      const jobIdEpub = crypto.randomBytes(3).toString('hex')
      const pubsubChannelEpub = `EPUBCHECK.${ctx.user}.${jobIdEpub}`
      const epubJobId = await jobQueue.publish('epubcheck', {
        filename: path.basename(epubFilePath),
        pubsubChannelEpub,
      })

      const validationResponse = new Promise((resolve, reject) => {
        pubsub.subscribe(
          pubsubChannelEpub,
          async ({ epubcheckJob: { status } }) => {
            logger.info(pubsubChannelEpub, status)
            if (status === 'Validation complete') {
              await waait(1000)
              const job = await db('pgboss.job').whereRaw(
                "data->'request'->>'id' = ?",
                [epubJobId],
              )

              resolve(job[0].data.response)
            }
          },
        )
      })

      const validationResult = await validationResponse

      const { error } = validationResult
      // End

      if (error) {
        throw new Error(error)
      }

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

      return { path: resultPath }
    }

    if (previewer === 'pagedjs' || fileExtension === 'pdf') {
      if (fileExtension === 'pdf') {
        const { hash } = await pagednation(book, template, true)
        const path = require('path')

        await fs.emptyDir(`${process.cwd()}/uploads/pdfs`)
        const pdf = path.join(`${process.cwd()}/`, `uploads/pdfs/${hash}.pdf`)

        const jobIdPDF = crypto.randomBytes(3).toString('hex')
        const pubsubChannelPdf = `PDF.${ctx.user}.${jobIdPDF}`
        const icmlId = await jobQueue.publish('pdf', {
          filePath: `/uploads/paged/${hash}/index.html`,
          outputPath: `/uploads/pdfs/${hash}.pdf`,
          pubsubChannelPdf,
        })

        const pdfResponse = new Promise((resolve, reject) => {
          pubsub.subscribe(pubsubChannelPdf, async ({ pdfJob: { status } }) => {
            logger.info(pubsubChannelPdf, status)
            if (status === 'PDF creation completed') {
              await waait(1000)
              const job = await db('pgboss.job').whereRaw(
                "data->'request'->>'id' = ?",
                [icmlId],
              )

              resolve(job[0].data.response)
            }
          })
        })

        await pdfResponse
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
      const { path: icmlTempFolder, hash } = await icmlPreparation(book)

      // Init Job pandoc
      const jobIdIcml = crypto.randomBytes(3).toString('hex')
      const pubsubChannelIcml = `ICML.${ctx.user}.${jobIdIcml}`
      const icmlId = await jobQueue.publish('pandoc', {
        filepath: hash,
        pubsubChannelIcml,
      })

      const pandocResponse = new Promise((resolve, reject) => {
        pubsub.subscribe(
          pubsubChannelIcml,
          async ({ pandocJob: { status } }) => {
            logger.info(pubsubChannelIcml, status)
            if (status === 'ICML creation completed') {
              await waait(1000)
              const job = await db('pgboss.job').whereRaw(
                "data->'request'->>'id' = ?",
                [icmlId],
              )

              resolve(job[0].data.response)
            }
          },
        )
      })

      await pandocResponse
      // End

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
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = EpubBackend
