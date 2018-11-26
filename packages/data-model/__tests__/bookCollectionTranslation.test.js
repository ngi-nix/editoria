const registerComponents = require('./helpers/registerComponents')
registerComponents(['bookCollection', 'bookCollectionTranslation', 'language'])

const { dbCleaner } = require('pubsweet-server/test')

const {
  BookCollection,
  BookCollectionTranslation,
  Language,
} = require('../src').models

// const {
//   model: BookCollectionTranslation,
// } = require('../src/bookCollectionTranslation')
// const { model: BookCollection } = require('../src/bookCollection')
// const { model: Language } = require('../src/language')

describe('Book Collection Translation', () => {
  beforeEach(async () => {
    await dbCleaner()
  })

  it('can add book collection translations', async () => {
    let collection, language, translation

    await new BookCollection().save().then(res => (collection = res))
    await new Language({ langIso: 'el' }).save().then(res => (language = res))
    // console.log(language)

    await new BookCollectionTranslation({
      collectionId: collection.id,
      languageId: language.id,
      title: 'mine',
    })
      .save()
      .then(res => (translation = res))

    // console.log(translation)
    await translation.getCollection()
    // .then(res => console.log(res))

    await translation.getLanguage()
    // .then(res => console.log(res))
  })
})
