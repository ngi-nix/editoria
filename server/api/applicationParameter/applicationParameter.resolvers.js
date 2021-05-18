const { logger } = require('@coko/server')
const { pubsubManager } = require('@coko/server')

const { UPDATE_APPLICATION_PARAMETERS } = require('./constants')
const {
  useCaseGetApplicationParameters,
  useCaseUpdateApplicationParameters,
} = require('../useCases')

const getApplicationParameters = async (_, args, ctx) => {
  try {
    const { context, area } = args
    logger.info(
      'application parameters resolver: executing getApplicationParameters use case',
    )

    return useCaseGetApplicationParameters(context, area)
  } catch (e) {
    throw new Error(e)
  }
}

const updateApplicationParameters = async (_, { input }, ctx) => {
  try {
    const { context, area, config } = input
    const pubsub = await pubsubManager.getPubsub()

    logger.info(
      'application parameters resolver: executing updateApplicationParameters use case',
    )

    const updatedApplicationParameters = await useCaseUpdateApplicationParameters(
      context,
      area,
      config,
    )

    logger.info(
      'application parameters resolver: broadcasting updated application parameters to clients',
    )

    pubsub.publish(UPDATE_APPLICATION_PARAMETERS, {
      updateApplicationParameters: updatedApplicationParameters,
    })

    return updatedApplicationParameters
  } catch (e) {
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
