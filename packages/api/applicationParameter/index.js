module.exports = {
  resolvers: require('./applicationParameter.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')(
    'applicationParameter/applicationParameter.graphql',
  ),
}
