const registerComponents = require('./helpers/registerComponents')
registerComponents(['book', 'language', 'bookTranslation', 'bookCollection'])

const uuid = require('uuid/v4')
const { dbCleaner } = require('pubsweet-server/test')
const {
  Book,
  BookCollection,
  BookTranslation,
  Language,
} = require('../src').models

describe('BookTranslation', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add book translations', async () => {
    let book, collection, language, translation

    await new BookCollection().save().then(res => (collection = res))

    await new Book({
      collectionId: collection.id,
      divisions: [uuid()],
      license: 'booha',
    })
      .save()
      .then(res => (book = res))

    await new Book({
      collectionId: collection.id,
      divisions: [uuid()],
    }).save()

    await new Language({ langIso: 'en' }).save().then(res => (language = res))

    await new BookTranslation({
      bookId: book.id,
      languageId: language.id,
      title: 'some title',
    })
      .save()
      .then(res => {
        // console.log(res)
        translation = res
      })

    await translation.getBook()
    // .then(res => console.log(res))

    await translation.getLanguage()
    // .then(res => console.log(res))
  })
})
