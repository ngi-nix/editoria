const { logger, useTransaction } = require('@coko/server')
const { ApplicationParameter } = require('../../data-model/src').models

const { pubsubManager } = require('@coko/server')

const { UPDATE_APPLICATION_PARAMETERS } = require('./consts')

const getApplicationParameters = async (_, args, ctx) => {
  const { context, area } = args
  const parameters = await ApplicationParameter.query()
    .skipUndefined()
    .where({ context, area })

  return parameters
}
const updateApplicationParameters = async (_, { input }, ctx) => {
  const { context, area, config } = input
  try {
    const pubsub = await pubsubManager.getPubsub()

    const updatedApplicationParameters = await useTransaction(async trx => {
      const applicationParameter = await ApplicationParameter.query(trx).where({
        context,
        area,
      })
      if (applicationParameter.length !== 1) {
        throw new Error(
          'multiple records for the same application parameters context and area',
        )
      }
      const { id } = applicationParameter[0]
      return ApplicationParameter.query(trx).patchAndFetchById(id, { config })
    })

    pubsub.publish(UPDATE_APPLICATION_PARAMETERS, {
      updateApplicationParameters: updatedApplicationParameters,
    })
    return updatedApplicationParameters
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getApplicationParameters,
  },
  Mutation: {
    updateApplicationParameters,
  },
  Subscription: {
    updateApplicationParameters: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(UPDATE_APPLICATION_PARAMETERS)
      },
    },
  },
}
