const path = require('path')
const winston = require('winston')

module.exports = {
  'pubsweet-server': {
    db: {
      port: 5460,
      user: 'test',
      password: 'secretpassword',
      database: global.__testDbName || 'editoria_test',
    },
    enableExperimentalGraphql: true,
    logger: new winston.Logger({
      transports: [
        new winston.transports.Console({
          colorize: true,
        }),
      ],
    }),
    pool: { min: 0, max: 10, idleTimeoutMillis: 1000 },
    port: 4000,
    secret: 'test',
    sse: false,
    uploads: 'uploads',
  },
  authsome: {
    mode: path.resolve(__dirname, 'auth'),
    teams: {
      teamTest: {
        name: 'Contributors',
      },
    },
  },
  pubsweet: {
    components: [
      '@pubsweet/model-user',
      'editoria-data-model/src/customTag',
    ],
  },
  schema: {
    Manuscript: {
      properties: {
        configField: { type: 'string' },
      },
    },
  },
}
