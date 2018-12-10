const pubsweetServer = require('pubsweet-server')
const forEach = require('lodash/forEach')

const { pubsubManager } = pubsweetServer
// console.log('pubsweet', pubsweetServer)

const { BOOK_CREATED, BOOK_DELETED, BOOK_RENAMED } = require('./const')
const {
  Book,
  BookTranslation,
  BookComponent,
  Division,
} = require('editoria-data-model/src').models

const getBook = async (_, { id }, ctx, info) => {
  const book = await Book.findById(id)

  if (!book) {
    throw new Error(`Book with id: ${id} does not exist`)
  }

  return book
}

const createBook = async (_, { input }, ctx) => {
  const { collectionId, title } = input
  const pubsub = await pubsubManager.getPubsub()

  const book = await new Book({
    collectionId,
  }).save()

  await new BookTranslation({
    bookId: book.id,
    title,
    languageIso: 'en',
  }).save()

  pubsub.publish(BOOK_CREATED, { bookCreated: book })
  // TODO: Probably create and assign teams too
  return book
}

const renameBook = async (_, { id, title }, ctx) => {
  const pubsub = await pubsubManager.getPubsub()
  const bookTranslation = await BookTranslation.query()
    .patch({ title })
    .where('bookId', id)

  const book = await Book.findById(id)

  pubsub.publish(BOOK_RENAMED, {
    bookRenamed: {
      id: book.id,
      collectionId: book.collectionId,
      title: bookTranslation.title,
    },
  })

  return book
}

const deleteBook = async (_, args, ctx) => {
  const pubsub = await pubsubManager.getPubsub()
  const deletedBook = await Book.query().patchAndFetchById(args.id, {
    deleted: true,
  })

  const associatedBookComponents = await BookComponent.query().where(
    'bookId',
    args.id,
  )
  if (associatedBookComponents.length > 0) {
    Promise.all(
      forEach(associatedBookComponents, async bookComponent => {
        await bookComponent
          .query()
          .patch({ deleted: true })
          .where('id', bookComponent.id)
      }),
    )
  }
  pubsub.publish(BOOK_DELETED, {
    bookDeleted: deletedBook,
  })
  return deletedBook
}

module.exports = {
  Query: {
    getBook,
  },
  Mutation: {
    createBook,
    renameBook,
    deleteBook,
  },
  Book: {
    async title(book, _, ctx) {
      const bookTranslation = await BookTranslation.query()
        .where('bookId', book.id)
        .where('languageIso', 'en')

      return bookTranslation[0].title
    },
    divisions(book, _, ctx) {
      return ctx.model.division.findByBookId({ bookId: book.id }).exec()
    },
  },
  Subscription: {
    bookCreated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_CREATED)
      },
    },
    bookDeleted: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_DELETED)
      },
    },
    bookRenamed: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_RENAMED)
      },
    },
  },
}
