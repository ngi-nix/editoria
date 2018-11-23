const book = require('./book')
const bookCollection = require('./bookCollection')
const bookCollectionTranslation = require('./bookCollectionTranslation')
const language = require('./language')

module.exports = {
  book,
  bookCollection,
  bookCollectionTranslation,
  language,
  models: {
    Book: book.model,
    BookCollection: bookCollection.model,
    BookCollectionTranslation: bookCollectionTranslation.model,
    Language: language.model,
  },
}
