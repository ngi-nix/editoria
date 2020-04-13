const logger = require('@pubsweet/logger')
const fs = require('fs')
const path = require('path')
const isUndefined = require('lodash/isUndefined')
const omitBy = require('lodash/omitBy')
const config = require('config')
const { File } = require('editoria-data-model/src').models

const uploadsPath = config.get('pubsweet-server').uploads

const getFiles = async (_, { input }, ctx) => {
  try {
    return []
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getFiles,
  },
  Mutation: {
    // updateFile,
  },
}
