const path = require('path')

module.exports = {
  'pubsweet-server': {
    db: {
      // temporary database name set by jest-environment-db
      // database: global.__testDbName || 'test',
      database: 'test',
      port: 5499,
      user: 'testuser',
      password: 'testpass',
    },
    pool: { min: 0, max: 10, idleTimeoutMillis: 1000 },
    enableExperimentalGraphql: true,
    port: 4000,
    secret: 'test',
    sse: false,
    uploads: 'uploads',
  },
  authsome: {
    mode: path.resolve(__dirname, '..', 'auth'),
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
