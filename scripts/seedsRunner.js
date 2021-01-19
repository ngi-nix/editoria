const logger = require('@pubsweet/logger')
const config = require('config')
const {
  createAdminUser,
  createApplicationParams,
  createBookCollection,
  createGlobalTeams,
} = require('./seeds')

const adminUser = config.get('pubsweet-server.admin')

const runner = async () => {
  try {
    await createAdminUser({
      ...adminUser,
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
