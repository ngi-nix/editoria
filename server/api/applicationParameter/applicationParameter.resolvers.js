const logger = require('@pubsweet/logger')
const { ApplicationParameter } = require('../../data-model/src').models

const pubsweetServer = require('pubsweet-server')

const { UPDATE_APPLICATION_PARAMETERS } = require('./consts')

const { pubsubManager } = pubsweetServer

const getApplicationParameters = async (_, args, ctx) => {
  const { context, area } = args
  const parameters = await ApplicationParameter.query()
    .skipUndefined()
    .where({ context, area })

  // console.log(parameters)

  // console.log(
  //   parameters.map(parameter => {
  //     console.log(parameter.config,11111)
  //     parameter.config = JSON.parse(parameter.config)
  //     console.log(parameter.config, 222)
  //     return parameter
  //   }),
  // )

  return parameters
}
const updateApplicationParameters = async (_, { input }, ctx) => {
  const { context, area, config } = input
  try {
    const pubsub = await pubsubManager.getPubsub()
    const parameter = await ApplicationParameter.query().findOne({
      context,
      area,
    })

    const updatedParameter = await parameter.$query().updateAndFetch({ config })

    const applicationParameters = await ApplicationParameter.query()

    pubsub.publish(UPDATE_APPLICATION_PARAMETERS, {
      updateApplicationParameters: applicationParameters,
    })
    return updatedParameter
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
