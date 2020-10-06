const models = require('../../data-model')

module.exports = {
  resolvers: require('./template.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('template/template.graphql'),
  model: models.template,
}
