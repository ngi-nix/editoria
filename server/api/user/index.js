const models = require('../../data-model')

module.exports = {
  resolvers: require('./user.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('user/user.graphql'),
  model: models.user,
}
