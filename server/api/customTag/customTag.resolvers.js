const { logger, pubsubManager } = require('@coko/server')

const { CUSTOM_TAG_UPDATED } = require('./constants')
const {
  useCaseGetCustomTags,
  useCaseAddCustomTag,
  useCaseUpdateCustomTag,
} = require('../useCases')

const getCustomTags = async (_, input, ctx) => {
  try {
    logger.info('custom tags resolver: executing getCustomTags use case')
    return useCaseGetCustomTags()
  } catch (e) {
    throw new Error(e)
  }
}

const addCustomTag = async (_, { input }, ctx) => {
  try {
    logger.info('custom tags resolver: executing addCustomTag use case')
    const pubsub = await pubsubManager.getPubsub()
    const { label, tagType } = input

    const newCustomTag = await useCaseAddCustomTag(label, tagType)

    pubsub.publish(CUSTOM_TAG_UPDATED, {
      customTagUpdated: newCustomTag,
    })
    logger.info('custom tags resolver: broadcasting new custom tag to clients')
    return newCustomTag
  } catch (e) {
    throw new Error(e)
  }
}

const updateCustomTag = async (_, { input }, ctx) => {
  try {
    logger.info('custom tags resolver: executing updateCustomTag use case')
    return useCaseUpdateCustomTag(input)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getCustomTags,
  },
  Mutation: {
    addCustomTag,
    updateCustomTag,
  },
  Subscription: {
    customTagUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(CUSTOM_TAG_UPDATED)
      },
    },
  },
}
