const logger = require('@pubsweet/logger')
const {
  createAdminUser,
  createApplicationParams,
  createBookCollection,
  createGlobalTeams,
} = require('./seeds')

const runner = async () => {
  try {
    await createAdminUser({
      username: 'admin',
      password: 'password',
      givenName: 'Admin',
      surname: 'Adminius',
      email: 'admin@example.com',
      admin: true,
    })
    await createApplicationParams()
    await createBookCollection()
    await createGlobalTeams()
  } catch (e) {
    logger.error(e.message)
  }
}

runner()
