const path = require('path')

module.exports = [
  // include app folder
  path.join(process.cwd(), 'app'),
  // include pubsweet and editoria packages which are published untranspiled
  /editoria-[^/]+\/(?!node_modules)/,
  /wax-[^/]+\/(?!node_modules)/,
  /pubsweet-[^/\\]+\/(?!node_modules)/,
  /@pubsweet\/[^/\\]+\/(?!node_modules)/,
  /@coko\/[^/\\]+\/(?!node_modules)/,
]
