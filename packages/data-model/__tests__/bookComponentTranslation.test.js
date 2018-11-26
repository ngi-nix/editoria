const registerComponents = require('./helpers/registerComponents')
registerComponents([
  'book',
  'bookCollection',
  'bookComponent',
  'bookComponentTranslation',
  'division',
  'language',
])

const uuid = require('uuid/v4')
const { dbCleaner } = require('pubsweet-server/test')

const {
  Book,
  BookCollection,
  BookComponent,
  BookComponentTranslation,
  Division,
  Language,
} = require('../src').models

describe('Book Component Translation', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can create book component translations', async () => {
    let book, collection, component, division, language, translation

    await new BookCollection().save().then(res => (collection = res))
    await new Book({
      collectionId: collection.id,
      divisions: [uuid()],
    })
      .save()
      .then(res => (book = res))

    await new Division({
      label: 'front',
      bookId: book.id,
    })
      .save()
      .then(res => (division = res))

    await new BookComponent({
      bookId: book.id,
      componentType: 'my type',
      divisionId: division.id,
    })
      .save()
      .then(res => (component = res))

    await new Language({ langIso: 'en' }).save().then(res => (language = res))

    await new BookComponentTranslation({
      bookComponentId: component.id,
      languageId: language.id,
    })
      .save()
      .then(res => (translation = res))

    // console.log(translation)

    await translation.getBookComponent()
    // .then(res => console.log(res))

    await translation.getLanguage()
    // .then(res => console.log(res))
  })
})
