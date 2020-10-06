// const config = require('config')
// const { knexSnakeCaseMappers } = require('objection')

// const connection = config['pubsweet-server'] && config['pubsweet-server'].db
// const pool = config['pubsweet-server'] && config['pubsweet-server'].pool

module.exports = {
  client: 'pg',
  // connection,
  // pool,
  // ...knexSnakeCaseMappers(),
  // acquireConnectionTimeout: 5000,
  // asyncStackTraces: true,
  migrations: {
    directory: 'src/book/migrations',
  },
}
