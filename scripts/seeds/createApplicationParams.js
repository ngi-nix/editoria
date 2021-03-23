#!/usr/bin/env node

const { logger } = require('@coko/server')
const db = require('@pubsweet/db-manager/src/db')

const {
  model: ApplicationParameter,
} = require('../../server/data-model/src/applicationParameter')

const configBooksprints = require('../../config/modules/bookBuilderBooksprints')
const configVanilla = require('../../config/modules/bookBuilderVanilla')

const flavour = process.env.EDITORIA_FLAVOUR

const truncate = async () => {
  await db.raw(`truncate table application_parameter cascade`)
  logger.info(`truncate table application parameter`)
}

const createApplicationParams = async () => {
  if (!flavour) {
    throw new Error(
      'env variable EDITORIA_FLAVOUR is needed in order to continue',
    )
  }

  if (flavour !== 'BOOKSPRINTS') {
    const areas = Object.keys(configVanilla)
    await truncate()
    await Promise.all(
      areas.map(async area => {
        const parameters = await new ApplicationParameter({
          context: 'bookBuilder',
          area,
          config: JSON.stringify(configVanilla[area]),
        }).save()
        logger.info(
          `New Application Parameter created: ${JSON.stringify(
            configVanilla[area],
          )}`,
        )
        return parameters
      }),
    )
  } else {
    const areas = Object.keys(configBooksprints)
    await truncate()
    await Promise.all(
      areas.map(async area => {
        const parameters = await new ApplicationParameter({
          context: 'bookBuilder',
          area,
          config: JSON.stringify(configBooksprints[area]),
        }).save()
        logger.info(
          `New Application Parameter created: ${JSON.stringify(
            configBooksprints[area],
          )}`,
        )
        return parameters
      }),
    )
  }
}

module.exports = createApplicationParams
