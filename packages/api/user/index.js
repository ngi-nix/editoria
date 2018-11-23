module.exports = {
  resolvers: require('./user.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('user/user.graphql'),
  // TODO: implement model
  // model: require('./user.model'),
}
