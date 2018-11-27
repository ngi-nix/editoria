const models = require('editoria-data-model')

module.exports = {
  resolvers: require('./division.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('division/division.graphql'),
  model: models.division,
}
