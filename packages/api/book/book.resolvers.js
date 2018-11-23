const getBook = async (_, args, ctx, info) => {
  const book = await ctx.models.book.findById(args.input.id).exec()

  if (!book) {
    throw new Error(`Book with id: ${args.input.id} does not exist`)
  }

  return book
}

const addBook = async (_, args, ctx) => {
  const language = await ctx.models.language.findByISO({ langISO: 'en' }).exec()
  const languageId = language.id
  const newBook = await ctx.models.book.create({
    collectionId: args.input.collectionId,
  })
  const bookTranslation = await ctx.models.bookTranslation.create({
    bookId: newBook.id,
    title: args.input.title,
    languageId,
  })

  // TODO: Probably create and assign teams too
  return {
    id: newBook.id,
    collectionId: newBook.collectionId,
    title: bookTranslation.title,
  }
}
const renameBook = async (_, args, ctx) => {
  const language = await ctx.models.language.findByISO({ langISO: 'en' }).exec()
  const languageId = language.id
  const updatedTranslation = await ctx.models.bookTranslation.update({
    bookId: args.input.id,
    languageId,
    title: args.input.title,
  })

  return {
    id: args.input.id,
    collectionId: args.input.collectionId,
    title: updatedTranslation.title,
  }
}

const deleteBook = async (_, args, ctx) =>
  ctx.models.book.update({ id: args.input.id, deleted: true })

module.exports = {
  Query: {
    getBook,
  },
  Mutation: {
    addBook,
    renameBook,
    deleteBook,
  },
  Book: {
    async title(book, _, ctx) {
      const language = await ctx.models.language
        .findByISO({ langISO: 'en' })
        .exec()
      const languageId = language.id
      const bookTranslation = await ctx.models.bookTranslation
        .findByFields({
          book: book.id,
          languageId,
        })
        .exec()
      return bookTranslation.title
    },
  },
}
