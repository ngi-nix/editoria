module.exports = {
  server: () => app => require('./controllers')(app),
}
