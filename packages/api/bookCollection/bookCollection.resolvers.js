const pubsweetServer = require('pubsweet-server')
const forEach = require('lodash/forEach')

const { pubSubManager } = pubsweetServer
const pubsub = pubSubManager.getPubsub()

const { COLLECTION_ADDED } = require('./const')

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

const createBookCollection = async (_, args, ctx) => {
  const bookCollection = await ctx.models.bookCollection
    .create(args.input)
    .exec()
  pubsub.publish(COLLECTION_ADDED, { collectionAdded: bookCollection })
}

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
      const bookCollectionTranslation = await ctx.models.bookCollectionTranslation
        .findByFields({
          collectionId: bookCollection.id,
          langISO: 'en',
        })
        .exec()
      return bookCollectionTranslation.title
    },
    async books(bookCollection, _, ctx) {
      const resolvedBooks = []
      const books = await ctx.models.book
        .findByCollectionId({
          collectionId: bookCollection.id,
        })
        .exec()

      forEach(books, async book => {
        const bookTranslation = await ctx.models.bookTranslation
          .findById({ bookId: book.id, langISO: 'en' })
          .exec()
        resolvedBooks.push({ id: book.id, title: bookTranslation.title })
      })

      return resolvedBooks
    },
  },
  Subscription: {
    collectionAdded: {
      subscribe: () => pubsub.asyncIterator(COLLECTION_ADDED),
    },
  },
}
