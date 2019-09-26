const HTMLEPUB = require('html-epub')
const fs = require('fs')
// const map = require('lodash/map')
// const groupBy = require('lodash/groupBy')
// const forEach = require('lodash/forEach')
// const pullAll = require('lodash/pullAll')
// const findIndex = require('lodash/findIndex')
const cheerio = require('cheerio')

const sorter = require('./sorter')
const converters = require('./converters')
const processFragment = require('./process')
const output = require('./output')
const config = require('config')
const pagednation = require('./pagednation')
const bookConstructor = require('./bookConstructor')

// const {
//   BookTranslation,
//   BookComponent,
//   BookComponentTranslation,
//   Division,
// } = require('editoria-data-model/src').models

// const divisionTypeMapper = {
//   Frontmatter: 'front',
//   Body: 'body',
//   Backmatter: 'back',
// }
const EpubBackend = async (
  bookId,
  destination,
  clientConverter,
  clientPreviewer,
  style,
  ctx,
) => {
  try {
    console.log('hello')
    // const previewer = clientPreviewer || 'vivliostyle'
    // const converter =
    //   clientConverter ||
    //   (config['pubsweet-client'] && config['pubsweet-client'].converter)
    //     ? config['pubsweet-client'].converter
    //     : 'default'

        const book = await bookConstructor(bookId, ctx)

        console.log('book', book)
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
