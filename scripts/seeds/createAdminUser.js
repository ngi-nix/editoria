const logger = require('@pubsweet/logger')
const { editoriaDataModel } = require('../../server/data-model')

const { models } = editoriaDataModel
const { User } = models

const createAdmin = async userData => {
  try {
    logger.info('### CREATING ADMIN USER ###')
    logger.info('>>> checking if admin user already exists...')

    const { username, password, email, givenName, surname } = userData

    const adminExists = await User.query().where({ admin: true, email })

    if (adminExists.length !== 0) {
      logger.warn('>>> an admin user already exists in the system')
      return false
    }

    logger.info('creating user')

    const newUser = new User({
      admin: true,
      password,
      givenName,
      surname,
      email,
      username,
    })
    await newUser.save()

    logger.info(
      `>>> admin user  with username "${username}" successfully created.`,
    )

    return true
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

module.exports = createAdmin