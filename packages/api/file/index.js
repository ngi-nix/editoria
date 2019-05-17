module.exports = {
  resolvers: require('./file.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('file/file.graphql'),
  // TODO: implement model
  // model: require('./file.model'),
}
