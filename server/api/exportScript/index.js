module.exports = {
  resolvers: require('./exportScript.resolver.js'),
  typeDefs: require('../graphqlLoaderUtil')(
    'exportScript/exportScript.graphql',
  ),
}
