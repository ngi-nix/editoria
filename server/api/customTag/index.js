const models = require('../../data-model')

module.exports = {
  resolvers: require('./customTag.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('customTag/customTag.graphql'),
  model: models.customTag,
}
