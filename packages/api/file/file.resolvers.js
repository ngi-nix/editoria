const logger = require('@pubsweet/logger')
const fs = require('fs')
const isUndefined = require('lodash/isUndefined')
const omitBy = require('lodash/omitBy')

const { File } = require('editoria-data-model/src').models

const updateFile = async (_, { input }, ctx) => {
  try {
    const { id, data, ...restFile } = input
    const result = omitBy(restFile, isUndefined)
    const currentFile = await File.query().patchAndFetchById(id, result)
    if (data) {
      fs.writeFileSync(currentFile.source, data)
    }

    return currentFile
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Mutation: {
    updateFile,
  },
}
