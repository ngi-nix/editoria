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

  // TODO: Probably create and assign teams too
  return book
}

const renameBook = async (_, { id, title }, ctx) => {
  await BookTranslation.query()
    .patch({ title })
    .where('bookId', id)

  return Book.findById(id)
}

const deleteBook = async (_, args, ctx) =>
  ctx.models.book.update({ id: args.input.id, deleted: true })

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
}
