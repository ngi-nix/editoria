module.exports = {
  resolvers: require('./book.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('book/book.graphql'),
  // TODO: implement model
  // model: require('./book.model'),
}
