module.exports = {
  resolvers: require('./team.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('team/team.graphql'),
  // TODO: implement model
  // model: require('./team.model'),
}
