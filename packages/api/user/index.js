const models = require('editoria-data-model')

module.exports = {
  resolvers: require('./user.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('user/user.graphql'),
  model: models.user,
}
