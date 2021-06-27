const path = require('path')

const components = require('./components')
const winston = require('winston')
const authsomeVanilla = require('./modules/authsomeVanilla')
const authsomeBooksprints = require('./modules/authsomeBooksprints')
const bbVanilla = require('./modules/bookBuilderVanilla')
const bbBooksprints = require('./modules/bookBuilderBooksprints')
const waxVanilla = require('./modules/waxConfigVanilla')
const waxBooksprints = require('./modules/waxConfigBooksprints')
const permissions = require('./permissions')

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      colorize: true,
      handleExceptions: true,
      humanReadableUnhandledException: true,
    }),
  ],
})
const flavour = process.env.EDITORIA_FLAVOUR

module.exports = {
  authsome: flavour === 'BOOKSPRINTS' ? authsomeBooksprints : authsomeVanilla,
  bookBuilder: flavour === 'BOOKSPRINTS' ? bbBooksprints : bbVanilla,
  wax: flavour === 'BOOKSPRINTS' ? waxBooksprints : waxVanilla,
  epub: {
    fontsPath: '/uploads/fonts',
  },
  'password-reset': {
    path: 'password-reset',
  },
  mailer: {
    from: 'info@editoria.com',
    path: path.join(__dirname, 'mailer'),
  },
  permissions,
  publicKeys: [
    'authsome',
    'bookBuilder',
    'pubsweet',
    'pubsweet-client',
    'pubsweet-server',
    'validations',
    'wax',
  ],
  pubsweet: {
    components,
  },
  'pubsweet-client': {
    API_ENDPOINT: '/api',
    'login-redirect': '/',
    navigation: 'app/components/Navigation/Navigation.jsx',
    routes: 'app/routes.jsx',
    theme: 'ThemeEditoria',
    converter: 'ucp',
    port: 3000,
    protocol: 'http',
    host: 'localhost',
  },
  'pubsweet-server': {
    db: {},
    useGraphQLServer: true,
    useJobQueue: false,
    graphiql: true,
    tokenExpiresIn: '360 days',
    externalServerURL: undefined,
    logger,
    port: 3000,
    protocol: 'http',
    host: 'localhost',
    uploads: 'uploads',
    pool: { min: 0, max: 10, idleTimeoutMillis: 1000 },
  },
  templates: ['Atla'],
  export: {
    rootFolder: 'config/exportScripts',
    scripts: [],
  },
  schema: {},
  validations: path.join(__dirname, 'modules', 'validations'),
}
