module.exports = {
  server: () => app => require('./endpoint')(app),
  ...require('./graphql'),
}
