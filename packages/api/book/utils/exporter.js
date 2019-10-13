const cheerio = require('cheerio')
const { epubArchiver } = require('./epubArchiver')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const get = require('lodash/get')
const crypto = require('crypto')

const {
  substanceToHTML,
  cleanDataIdAttributes,
  vivliostyleDecorator,
} = require('./converters')

const { generateContainer } = require('./htmlGenerators')

const { htmlToEPUB } = require('./htmlToEPUB')
const bookConstructor = require('./bookConstructor')
const { pagednation } = require('./pagednation')
const { Template } = require('editoria-data-model/src').models

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const EpubBackend = async (
  bookId,
  mode,
  templateId,
  previewer,
  fileExtension,
  ctx,
) => {
  try {
    const template = await Template.findById(templateId)
    const { notes: notesType } = template
    const templateHasEndnotes = notesType === 'endnotes'
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
    if (templateHasEndnotes) {
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

      // const validationResult = await execCommand(
      //   'docker-compose run --rm epubcheck',
      // )
      // console.log('valid', validationResult)
      // await fs.remove(validatorPoolPath)
      // epubcheck here
      resultPath = epubFilePath

      if (previewer === 'vivliostyle') {
        const vivliostyleRoot = `${process.cwd()}/${uploadsDir}/vivliostyle/`
        const destination = path.join(
          vivliostyleRoot,
          `${crypto.randomBytes(32).toString('hex')}`,
        )
        await fs.ensureDir(destination)
        await fs.copy(tempFolder, destination)
        await fs.remove(epubFilePath)
        resultPath = destination
      }
      // await fs.remove(tempFolder)

      return resultPath

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
        const pagedFiles = await pagednation(book, template, true)
        // pagedjs-cli
        return resultPath
      }
      return await pagednation(book, template)
    }

    if (fileExtension === 'icml') {
      // append to single html file each book component
      // fix url images
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = EpubBackend
