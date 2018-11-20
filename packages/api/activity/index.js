module.exports = {
  resolvers: require('./activity.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('activity/activity.graphql'),
  // TODO: implement model
  // model: require('./activity.model'),
}
