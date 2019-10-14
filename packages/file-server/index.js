module.exports = {
  server: () => app => require('./FileServerBackend')(app),
}
