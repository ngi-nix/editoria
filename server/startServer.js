const { startServer } = require('pubsweet-server')

try {
  startServer()
} catch (e) {
  throw new Error(e)
}
