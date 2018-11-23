module.exports = {
  resolvers: require('./bookComponent.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')(
    'bookComponent/bookComponent.graphql',
  ),
  // TODO: implement model
  // model: require('./bookComponent.model'),
}
