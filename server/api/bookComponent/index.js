const models = require('../../data-model')

module.exports = {
  resolvers: require('./bookComponent.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')(
    'bookComponent/bookComponent.graphql',
  ),
  model: models.bookComponent,
}
