module.exports = {
  resolvers: require('./division.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('division/division.graphql'),
  // TODO: implement model
  // model: require('./division.model'),
}
