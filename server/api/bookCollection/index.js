const models = require('../../data-model')

module.exports = {
  resolvers: require('./bookCollection.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')(
    'bookCollection/bookCollection.graphql',
  ),
  model: models.bookCollection,
}
