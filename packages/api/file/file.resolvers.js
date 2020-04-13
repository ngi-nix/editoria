const logger = require('@pubsweet/logger')
const fs = require('fs')
const path = require('path')
const isUndefined = require('lodash/isUndefined')
const omitBy = require('lodash/omitBy')
const config = require('config')
const { File } = require('editoria-data-model/src').models

const uploadsPath = config.get('pubsweet-server').uploads

// const updateFile = async (_, { input }, ctx) => {
//   try {
//     const { id, data, hashed, ...restFile } = input
//     const result = omitBy(restFile, isUndefined)
//     const currentFile = await File.query().patchAndFetchById(id, result)
//     if (data) {
//       fs.writeFileSync(currentFile.source, data)
//       if (hashed) {
//         fs.writeFileSync(
//           path.join(uploadsPath, 'paged', hashed, currentFile.name),
//           data,
//         )
//       }
//     }

//     return currentFile
//   } catch (e) {
//     logger.error(e)
//     throw new Error(e)
//   }
// }

module.exports = {
  Mutation: {
    // updateFile,
  },
}
