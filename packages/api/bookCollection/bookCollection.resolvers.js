const pubsweetServer = require('pubsweet-server')
const {
  Book,
  BookCollectionTranslation,
} = require('editoria-data-model/src').models

const { pubsubManager } = pubsweetServer

const { COLLECTION_ADDED } = require('./consts')

const getBookCollection = async (_, args, ctx) =>
  ctx.connectors.BookCollection.fetchOne(args.input.id, ctx)

const getBookCollections = (_, args, ctx) => {
  /* eslint-disable-next-line no-console */
  console.log('sorting args', args)

  return ctx.connectors.BookCollection.fetchAll({}, ctx)
}

const createBookCollection = async (_, args, ctx) => {
  const pubsub = await pubsubManager.getPubsub()
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
      const bookCollectionTranslation = await BookCollectionTranslation.query()
        .where('collectionId', bookCollection.id)
        .andWhere('languageIso', 'en')

      return bookCollectionTranslation[0].title
    },
    async books(bookCollection, _, ctx) {
      return Book.query()
        .where('collectionId', bookCollection.id)
        .andWhere('deleted', false)
        .andWhere('archived', false)
    },
  },
  Subscription: {
    collectionAdded: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(COLLECTION_ADDED)
      },
    },
  },
}
