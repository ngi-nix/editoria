const path = require('path')

module.exports = [
  // include app folder
  path.join(__dirname, '..', 'app'),
  // include pubsweet and editoria packages which are published untranspiled
  /editoria-[^/]+\/(?!node_modules)/,
  /wax-[^/]+\/(?!node_modules)/,
  /pubsweet-[^/\\]+\/(?!node_modules)/,
  /@pubsweet\/[^/\\]+\/(?!node_modules)/,
  /packages\/[^/\\]+\/(?!node_modules)/,
]
