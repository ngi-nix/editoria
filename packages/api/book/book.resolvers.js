// Example file
// const book = async (_, args, ctx, info) => {
//   const book = await ctx.models.book.findById(args.input.id).exec()

//   if (!book) {
//     throw new Error('book does not exist')
//   }

//   return book
// }

// const books = (_, __, ctx) => ctx.models.book.find({}).exec()

// const newBook = (_, args, ctx) => ctx.models.book.create(args.input)

// module.exports = {
//   Query: {
//     book,
//     books,
//   },
//   Mutation: {
//     newBook,
//   },
//   Book: {
//     // placeholder for custom property resolvers
//   },
// }
