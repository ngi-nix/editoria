// const models = require('editoria-data-model')

module.exports = {
  resolvers: require('./authorize.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('authorize/authorize.graphql'),
  // model: models.book,
}
