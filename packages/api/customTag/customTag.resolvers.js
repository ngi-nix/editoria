const logger = require('@pubsweet/logger')
const { CustomTag } = require('editoria-data-model/src').models

const getCustomTags = async (_, {}, ctx) => {
  const customTags = await CustomTag.all()
  if (!customTags) {
    throw new Error(`CustomTags error: Could not fetch Tags`)
  }

  return customTags
}

const addCustomTag = async (_, { input }, ctx) => {
  try {
    Promise.all(
      input.map(async tag => {
        const { label, tagType } = tag
        await new CustomTag({ label, tagType }).save()
      }),
    )

    const customTags = await CustomTag.all()
    return customTags
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateCustomTag = async (_, { input }, ctx) => {
  try {
    Promise.all(
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

    const customTags = await CustomTag.all()
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
}
