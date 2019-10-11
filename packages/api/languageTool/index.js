module.exports = {
  resolvers: require('./languageTool.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')(
    'languageTool/languageTool.graphql',
  ),
}
