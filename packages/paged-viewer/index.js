module.exports = {
  backend: () => app => require('./PagedPreviewer')(app),
}
