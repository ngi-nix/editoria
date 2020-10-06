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
      '../../data-model/src/book',
      '../../data-model/src/lock',
      '../../data-model/src/bookCollection',
      '../../data-model/src/bookCollectionTranslation',
      '../../data-model/src/bookComponent',
      '../../data-model/src/bookComponentState',
      '../../data-model/src/bookComponentTranslation',
      '../../data-model/src/bookTranslation',
      '../../data-model/src/customTag',
      '../../data-model/src/division',
      '../../data-model/src/team',
      '../../data-model/src/user',
      '../../data-model/src/dataloader',
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
