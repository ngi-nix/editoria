const { logger, pubsubManager } = require('@coko/server')
const orderBy = require('lodash/orderBy')
const map = require('lodash/map')
const find = require('lodash/find')

const {
  BookCollectionTranslation,
  BookTranslation,
} = require('../../data-model/src').models
const {
  useCaseGetBookCollection,
  useCaseGetBookCollections,
  useCaseCreateBookCollection,
  useCaseGetEntityTeam,
  useCaseGetBooks,
} = require('../useCases')
const { COLLECTION_ADDED } = require('./consts')

const getBookCollection = async (_, { input }, ctx) => {
  try {
    const { id } = input

    logger.info(
      'book collection resolver: executing getBookCollection use case',
    )

    return useCaseGetBookCollection(id)
  } catch (e) {
    throw new Error(e)
  }
}

const getBookCollections = async (_, __, ctx) => {
  try {
    logger.info(
      'book collection resolver: executing getBookCollections use case',
    )

    return useCaseGetBookCollections()
  } catch (e) {
    throw new Error(e)
  }
}

const createBookCollection = async (_, { input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const { title, languageIso } = input

    logger.info(
      'book collection resolver: executing createBookCollection use case',
    )

    const createdBookCollection = await useCaseCreateBookCollection(
      title,
      languageIso,
    )
    logger.info(
      'book collection resolver: broadcasting new book collection to clients',
    )

    pubsub.publish(COLLECTION_ADDED, { collectionAdded: createdBookCollection })

    return createdBookCollection
  } catch (e) {
    throw new Error(e)
  }
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
      const books = await useCaseGetBooks(bookCollection.id, archived, ctx.user)
      const sortable = await Promise.all(
        map(books, async book => {
          const translation = await BookTranslation.query()
            .where('bookId', book.id)
            .andWhere('languageIso', 'en')
          const { title } = translation[0]
          const authorsTeam = await useCaseGetEntityTeam(
            book.id,
            'book',
            'author',
            true,
          )

          let auth = 'z'
          if (authorsTeam && authorsTeam.members.length > 0) {
            auth = authorsTeam.members[0].surname
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
      const result = map(sorted, item => find(books, { id: item.id }))
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
