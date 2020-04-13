module.exports = {
  resolvers: require('./s3.resolvers'),
  typeDefs: require('../graphqlLoaderUtil')('awsS3/s3.graphql'),
}
