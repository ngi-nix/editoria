const { startServer } = require('@coko/server')

try {
  startServer()
} catch (e) {
  throw new Error(e)
}
