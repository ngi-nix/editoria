const path = require('path')
const winston = require('winston')

module.exports = {
  'pubsweet-server': {
    db: {
      // database: 'test',
      port: 5499,
      user: 'testuser',
      password: 'testpass',
      database: global.__testDbName || 'test',
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
  schema: {
    Manuscript: {
      properties: {
        configField: { type: 'string' },
      },
    },
  },
}
