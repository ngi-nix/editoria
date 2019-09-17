const logger = require('@pubsweet/logger')
const { CustomTag } = require('editoria-data-model/src').models

const { CUSTOM_TAG_UPDATED } = require('./consts')

const pubsweetServer = require('pubsweet-server')

const { pubsubManager } = pubsweetServer

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
        await new CustomTag({ label, tagType }).save()
      }),
    )

    const customTags = await CustomTag.query().where({ deleted: false })
    console.log(customTags)
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
    const pubsub = await pubsubManager.getPubsub()
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
    logger.info(`Custom Tag component with id ${updateCustomTag.id} deleted`)

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
