const { logger } = require('@coko/server')
const { CustomTag } = require('../../data-model/src').models

const { CUSTOM_TAG_UPDATED } = require('./consts')

const { pubsubManager } = require('@coko/server')

const getCustomTags = async (_, input, ctx) => {
  const customTags = await CustomTag.query().where({ deleted: false })
  if (!customTags) {
    throw new Error(`CustomTags error: Could not fetch Tags`)
  }

  return customTags
}

const addCustomTag = async (_, { input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    await Promise.all(
      input.map(async tag => {
        const { label, tagType } = tag
        await CustomTag.query().insert({ label, tagType })
      }),
    )

    const customTags = await CustomTag.query().where({ deleted: false })

    pubsub.publish(CUSTOM_TAG_UPDATED, {
      customTagUpdated: customTags,
    })

    return customTags
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateCustomTag = async (_, { input }, ctx) => {
  try {
    await Promise.all(
      input.map(async tag => {
        const { id, deleted, tagType, label } = tag
        await CustomTag.query().patchAndFetchById(id, {
          label,
          deleted,
          tagType,
        })
      }),
    )

    const customTags = await CustomTag.query().where({ deleted: false })

    return customTags
  } catch (e) {
    logger.error(e)
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
