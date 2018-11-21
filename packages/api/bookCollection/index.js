module.exports = {
  resolvers: require('./bookCollection.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')(
    'bookCollection/bookCollection.graphql',
  ),
  // TODO: implement model
  // model: require('./activity.model'),
}
