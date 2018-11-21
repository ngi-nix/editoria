const forEach = require('lodash/forEach')

const getBookCollection = async (_, args, ctx) => {
  const bookCollection = await ctx.models.bookCollection
    .findById(args.input.id)
    .exec()

  if (!bookCollection) {
    throw new Error(`Book Collection with id: ${args.input.id} does not exist`)
  }

  return bookCollection
}

const getBookCollections = (_, __, ctx) =>
  ctx.models.bookCollection.find({}).exec()

const createBookCollection = (_, args, ctx) =>
  ctx.models.bookCollection.create(args.input)

module.exports = {
  Query: {
    getBookCollection,
    getBookCollections,
  },
  Mutation: {
    createBookCollection,
  },
  BookCollection: {
    async title(bookCollection, _, ctx) {
      const language = await ctx.models.language
        .findByISO({ langISO: 'en' })
        .exec()
      const languageId = language.id
      const bookCollectionTranslation = await ctx.models.bookCollectionTranslation
        .findByFields({
          collectionId: bookCollection.id,
          languageId,
        })
        .exec()
      return bookCollectionTranslation.title
    },
    async books(bookCollection, _, ctx) {
      const resolvedBooks = []
      const language = await ctx.models.language
        .findByISO({ langISO: 'en' })
        .exec()
      const languageId = language.id
      const books = await ctx.models.book
        .findByCollectionId({
          collectionId: bookCollection.id,
        })
        .exec()

      forEach(books, async book => {
        const bookTranslation = await ctx.models.bookTranslation
          .findById({ bookId: book.id, languageId })
          .exec()
        resolvedBooks.push({ id: book.id, title: bookTranslation.title })
      })

      return resolvedBooks
    },
  },
}
