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
  bookBuilder: {
    divisions: [{ name: 'front' }, { name: 'body' }, { name: 'back' }],
  },
  pubsweet: {
    components: [
      '@pubsweet/model-user',
      '@pubsweet/model-team',
      'editoria-data-model/src/book',
      'editoria-data-model/src/lock',
      'editoria-data-model/src/bookCollection',
      'editoria-data-model/src/bookCollectionTranslation',
      'editoria-data-model/src/bookComponent',
      'editoria-data-model/src/bookComponentState',
      'editoria-data-model/src/bookComponentTranslation',
      'editoria-data-model/src/bookTranslation',
      'editoria-data-model/src/customTag',
      'editoria-data-model/src/division',
      'editoria-data-model/src/team',
      'editoria-data-model/src/user',
      'editoria-data-model/src/dataloader',
      'editoria-api',
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
