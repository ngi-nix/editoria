const pubsweetServer = require('pubsweet-server')
const orderBy = require('lodash/orderBy')
const map = require('lodash/map')
const find = require('lodash/find')
const {
  BookCollectionTranslation,
  BookTranslation,
} = require('editoria-data-model/src').models

const { pubsubManager } = pubsweetServer

const { COLLECTION_ADDED } = require('./consts')

const eager = '[members.[user, alias]]'

const getBookCollection = async (_, args, ctx) =>
  ctx.connectors.BookCollection.fetchOne(args.input.id, ctx)

const getBookCollections = async (_, __, ctx) =>
  ctx.connectors.BookCollection.fetchAll({}, ctx)

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
    async books(bookCollection, { ascending, sortKey, archived }, ctx, info) {
      let books
      if (archived) {
        books = await ctx.connectors.Book.fetchAll(
          {
            collectionId: bookCollection.id,
            deleted: false,
          },
          ctx,
        )
      } else {
        books = await ctx.connectors.Book.fetchAll(
          {
            collectionId: bookCollection.id,
            deleted: false,
            archived: false,
          },
          ctx,
        )
      }

      const sortable = await Promise.all(
        map(books, async book => {
          const translation = await BookTranslation.query()
            .where('bookId', book.id)
            .andWhere('languageIso', 'en')
          const { title } = translation[0]
          const teams = await ctx.connectors.Team.fetchAll(
            { objectId: book.id, role: 'author' },
            ctx,
            { eager },
          )
          let auth = 'z'
          if (teams[0] && teams[0].members.length > 0) {
            auth = teams[0].members[0].user.surname
          }
          let status = 0

          if (book.publicationDate !== null) {
            const date = book.publicationDate
            const inTimestamp = new Date(date).getTime()
            const nowDate = new Date()
            const nowTimestamp = nowDate.getTime()
            if (inTimestamp <= nowTimestamp) {
              status = 1
            } else {
              status = 0
            }
          }
          return {
            id: book.id,
            title: title.toLowerCase().trim(),
            status,
            author: auth,
          }
        }),
      )

      const order = ascending ? 'asc' : 'desc'
      const sorter = []
      if (sortKey === 'title') {
        sorter.push(sortKey)
      } else {
        sorter.push(sortKey)
        sorter.push('title')
      }
      const sorted = orderBy(sortable, sorter, [order])
      const result = map(sorted, item => {
        return find(books, { id: item.id })
      })
      return result
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
