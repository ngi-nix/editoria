const pubsweetServer = require('pubsweet-server')

const { pubSubManager } = pubsweetServer
const pubsub = pubSubManager.getPubsub()

const { BOOK_ADDED, BOOK_DELETED, BOOK_RENAMED } = require('./const')
const { Book, BookTranslation } = require('editoria-data-model/src').models

const getBook = async (_, args, ctx, info) => {
  const book = await ctx.models.book.findById(args.input.id).exec()

  if (!book) {
    throw new Error(`Book with id: ${args.input.id} does not exist`)
  }

  return book
}

const createBook = async (_, { input }, ctx) => {
  const { collectionId, title } = input

  const book = await new Book({
    collectionId,
  }).save()

  await new BookTranslation({
    bookId: book.id,
    title,
    languageIso: 'en',
  }).save()

  pubsub.publish(BOOK_ADDED, { bookAdded: book })
  // TODO: Probably create and assign teams too
  return book
}

const renameBook = async (_, { id, title }, ctx) => {
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
  const deletedBook = await ctx.models.book
    .update({ id: args.input.id, deleted: true })
    .exec()
  pubsub.publish(BOOK_DELETED, { bookDeleted: deletedBook.id })
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
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(BOOK_ADDED),
    },
    bookDeleted: {
      subscribe: () => pubsub.asyncIterator(BOOK_DELETED),
    },
    bookRenamed: {
      subscribe: () => pubsub.asyncIterator(BOOK_RENAMED),
    },
  },
}
