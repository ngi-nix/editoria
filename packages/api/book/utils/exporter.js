// const HTMLEPUB = require('html-epub')
// const fs = require('fs')
// const map = require('lodash/map')
// const groupBy = require('lodash/groupBy')
// const forEach = require('lodash/forEach')
// const pullAll = require('lodash/pullAll')
// const findIndex = require('lodash/findIndex')
const cheerio = require('cheerio')
const archiver = require('archiver')
const fs = require('fs')
const { exec } = require('child_process')

// const contains = require('lodash/contains')

// const sorter = require('./sorter')
const {
  substanceToHTML,
  cleanDataIdAttributes,
  vivliostyleDecorator,
} = require('./converters')
const {
  generateContainer,
  generatePagedjsContainer,
} = require('./htmlGenerators')
const { htmlToEPUB } = require('./htmlToEPUB')
const processFragment = require('./process')
const output = require('./output')
const config = require('config')
const pagednation = require('./pagednation')
const bookConstructor = require('./bookConstructor')

const { Template } = require('editoria-data-model/src').models

// const divisionTypeMapper = {
//   Frontmatter: 'front',
//   Body: 'body',
//   Backmatter: 'back',
// }

const EpubBackend = async (
  bookId,
  mode,
  templateId,
  previewer,
  fileExtension,
  ctx,
) => {
  try {
    console.log('hello', bookId, mode, templateId, previewer, fileExtension)

    const template = await Template.findById(templateId)
    const { notes: notesType } = template
    const templateHasEndnotes = notesType === 'endnotes'

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

        if (componentType === 'toc' || componentType === 'endnotes') return

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

    // Check if notes exist
    const $ = cheerio.load(endnotesComponent.content)
    if ($('ol').length === 0) {
      backDivision.bookComponents.delete('endnotes')
    }

    if (previewer === 'vivliostyle' || fileExtension === 'epub') {
      if (previewer === 'vivliostyle') {
        book.divisions.forEach((division, divisionId) => {
          division.bookComponents.forEach((bookComponent, bookComponentId) => {
            const { content } = bookComponent
            bookComponent.content = vivliostyleDecorator(content, book.title)
          })
        })
      }
      const tempFolder = await htmlToEPUB(book, template)

      // create a file to stream archive data to.
      var output = fs.createWriteStream(
        `${process.cwd()}/` + 'epubchecker_data/test.epub',
      )
      var archive = archiver('zip')

      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', function() {
        console.log(archive.pointer() + ' total bytes')
        console.log(
          'archiver has been finalized and the output file descriptor has closed.',
        )
      })

      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      output.on('end', function() {
        console.log('Data has been drained')
      })

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err
        }
      })

      // good practice to catch this error explicitly
      archive.on('error', function(err) {
        throw err
      })

      // pipe archive data to the file
      archive.pipe(output)
      archive.append('application/epub+zip', { name: 'mimetype', store: true })
      archive.directory(tempFolder, false)
      archive.finalize()

      exec(`docker-compose run --rm epubcheck`, function(
        error,
        stdout,
        stderr,
      ) {
        console.log('1', stdout)
        console.log('2', error)
        console.log('3', stderr)
      })

      // Here start the logic of html to epub
      // each book component decorate with html-body
      // each book component decorate with valid epub properties epub:type, etc
      // fix urls (imgs, stylesheet, in actual css fix the fonts path if any)
    }

    if (previewer === 'pagedjs' || fileExtension === 'pdf') {
      const output = cheerio.load(generatePagedjsContainer(book.title))
      book.divisions.forEach((division, divisionId) => {
        division.bookComponents.forEach((bookComponent, bookComponentId) => {
          // console.log('types', bookComponent.componentType)
          const { content } = bookComponent
          output('body').append(content)
        })
      })
      console.log('o', output.html())
      // append to single html file each book component
      // fix (fonts url if any in css file)
    }

    if (fileExtension === 'icml') {
      // append to single html file each book component
      // fix url images
    }

    // console.log('book', book)
    // for (let [divisionId, division] of book.divisions) {
    //   console.log('division', division)
    // }
    // const bookTranslation = await BookTranslation.query()
    //   .where('bookId', bookId)
    //   .andWhere('languageIso', 'en')

    // const book = {
    //   title: bookTranslation[0].title,
    //   identifier: bookId,
    // }
    // // chapters
    // const bookComponentIds = []
    // const divisions = await Division.query()
    //   .where('bookId', bookId)
    //   .andWhere('deleted', false)

    // forEach(divisions, division => {
    //   const { bookComponents } = division
    //   forEach(bookComponents, id => {
    //     bookComponentIds.push(id)
    //   })
    // })

    // const convertedBookComponents = await Promise.all(
    //   map(bookComponentIds, async (bookComponentId, i) => {
    //     const bookComponent = await BookComponent.findById(bookComponentId)
    //     const bookComponentTranslation = await BookComponentTranslation.query()
    //       .where('bookComponentId', bookComponent.id)
    //       .andWhere('languageIso', 'en')
    //     const division = await Division.findById(bookComponent.divisionId)
    //     const sortedPerDivision = await Promise.all(
    //       map(division.bookComponents, async id => {
    //         const bookComponent = await BookComponent.query()
    //           .where('id', id)
    //           .andWhere('deleted', false)
    //         return bookComponent[0]
    //       }),
    //     )

    //     const groupedByType = groupBy(
    //       pullAll(sortedPerDivision, [undefined]),
    //       'componentType',
    //     )

    //     const componentTypeNumber =
    //       findIndex(
    //         groupedByType[bookComponent.componentType],
    //         item => item.id === bookComponent.id,
    //       ) + 1

    //     return {
    //       id: bookComponent.id,
    //       content: bookComponentTranslation[0].content,
    //       title: bookComponentTranslation[0].title,
    //       componentType: bookComponent.componentType,
    //       division: divisionTypeMapper[division.label],
    //       number: componentTypeNumber,
    //     }
    //   }),
    // )

    // ?????????
    // ?????????
    // ?????????
    // let notesPart
    // if (converter === 'ucp') {
    //   notesPart = cheerio.load(
    //     '<html><body><section id="comp-notes-0" data-type="notes"><header><h1 class="ct">Notes</h1></header></section></body></html>',
    //   )
    // }

    // // CSS Theme

    // // TODO: change it from array to the name of the selected theme
    // let styles = [style].filter(name => name)
    // // TODO: to be desided where the per applications themes should live
    // let stylesRoot = `${process.cwd()}/static`

    // if (styles.length === 0 || !fs.existsSync(`${stylesRoot}/${styles[0]}`)) {
    //   if (previewer === 'vivliostyle') {
    //     styles = ['default.css']
    //   } else {
    //     styles = ['paged_default.css']
    //   }
    //   stylesRoot = `${__dirname}/themes`
    // }

    // let fontsRoot =
    //   config.epub && config.epub.fontsPath
    //     ? process.cwd() + config.epub.fontsPath
    //     : null

    // if (!fs.existsSync(fontsRoot)) fontsRoot = ''

    // // converters
    // const activeConverters = [`wax-${previewer}-${converter}`]
    //   .filter(name => name && converters[name])
    //   .map(name => converters[name])

    // const parts = convertedBookComponents.sort(sorter).map(
    //   processFragment({
    //     styles,
    //     activeConverters,
    //     book,
    //     notesPart,
    //     previewer,
    //   }),
    // )

    // if (converter === 'ucp') {
    //   const notesFragment = {
    //     content: notesPart.html(),
    //     division: 'back',
    //     componentType: 'component',
    //     title: 'Notes',
    //     id: 'notes-0',
    //   }

    //   const notes = processFragment({
    //     styles,
    //     activeConverters,
    //     book,
    //     notesPart,
    //     previewer,
    //   })(notesFragment)

    //   const notesHTML = cheerio.load(notesPart.html())
    //   const hasNotes = notesHTML('ol').length > 0
    //   if (hasNotes) {
    //     parts.push(notes)
    //   }
    // }

    // // TODO: read the path to the uploads folder from config
    // const resourceRoot = `${process.cwd()}/uploads`

    // let outcome
    // switch (previewer) {
    //   default: {
    //     outcome = new HTMLEPUB(book, { resourceRoot, stylesRoot, fontsRoot })
    //     await outcome.load(parts)
    //     break
    //   }
    //   case 'paged': {
    //     outcome = await pagednation.create(
    //       book,
    //       parts,
    //       resourceRoot,
    //       stylesRoot,
    //       fontsRoot,
    //     )
    //     break
    //   }
    // }

    // if (destination === 'folder') {
    //   return output.folder(outcome, stylesRoot, previewer)
    // }
    // return output.attachment(outcome, bookId)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = EpubBackend
