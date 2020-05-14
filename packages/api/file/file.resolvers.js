const logger = require('@pubsweet/logger')
const map = require('lodash/map')
const union = require('lodash/union')
const { FileTranslation } = require('editoria-data-model/src').models
const pubsweetServer = require('pubsweet-server')

const {
  useCaseUploadFile,
  useCaseUpdateFile,
  useCaseCreateFile,
  useCaseGetEntityFiles,
  useCaseGetSpecificFiles,
  useCaseGetFiles,
  useCaseGetFile,
  useCaseSignURL,
  useCaseDeleteDBFiles,
  useCaseUpdateFiles,
} = require('../useCases')

const { FILES_UPLOADED, FILE_UPDATED, FILES_DELETED } = require('./consts')

const { pubsubManager } = pubsweetServer

const getEntityFiles = async (_, { input }, ctx) => {
  try {
    const { entityId, entityType, sortingParams } = input
    return useCaseGetEntityFiles(entityId, entityType, sortingParams)
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const getSpecificFiles = async (_, { ids }, ctx) => {
  try {
    return useCaseGetSpecificFiles(ids)
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const getFiles = async (_, __, ctx) => {
  try {
    return useCaseGetFiles()
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const getFile = async (_, { id }, ctx) => {
  try {
    return useCaseGetFile(id)
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const uploadFiles = async (_, { files, entityType, entityId }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const uploadedFiles = await Promise.all(
      map(files, async file => {
        const { createReadStream, filename, mimetype, encoding } = await file
        const fileStream = createReadStream()

        const { original } = await useCaseUploadFile(
          fileStream,
          filename,
          mimetype,
          encoding,
        )
        const { key, location, metadata, size, extension } = original
        return useCaseCreateFile(
          { name: filename, size, mimetype, metadata, extension },
          { location, key },
          entityType,
          entityId,
        )
      }),
    )
    pubsub.publish(FILES_UPLOADED, {
      filesUploaded: uploadedFiles,
    })
    return uploadFiles
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateFile = async (_, { input }, ctx) => {
  try {
    const { id, name, alt } = input
    const pubsub = await pubsubManager.getPubsub()
    const updatedFile = await useCaseUpdateFile(id, { name, alt })
    pubsub.publish(FILE_UPDATED, {
      fileUpdated: updatedFile,
    })
    return updatedFile
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const deleteFiles = async (_, { ids, remoteToo }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    let deletedFiles
    if (remoteToo) {
      deletedFiles = await useCaseDeleteDBFiles(ids, remoteToo)
    } else {
      deletedFiles = await useCaseDeleteDBFiles(ids)
    }
    pubsub.publish(FILES_DELETED, {
      filesDeleted: deletedFiles,
    })
    return deletedFiles
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const bulkFilesCorrelation = async (
  _,
  { toCorrelate, toUnCorrelate, entityId, entityType },
  ctx,
) => {
  try {
    if (toCorrelate.length > 0) {
      await useCaseUpdateFiles(toCorrelate, { [`${entityType}Id`]: entityId })
    }
    if (toUnCorrelate.length > 0) {
      await useCaseUpdateFiles(toUnCorrelate, { [`${entityType}Id`]: null })
    }
    return union(toCorrelate, toUnCorrelate)
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getEntityFiles,
    getSpecificFiles,
    getFiles,
    getFile,
  },
  Mutation: {
    uploadFiles,
    updateFile,
    deleteFiles,
    bulkFilesCorrelation,
  },
  File: {
    async alt({ id }, _, ctx) {
      const translation = await FileTranslation.query().where({
        fileId: id,
        languageIso: 'en',
      })
      if (translation.length === 1) return translation[0].alt

      return null
    },
    async source({ objectKey, mimetype }, { size }, ctx) {
      if (mimetype.match(/^image\//)) {
        if (size && size !== 'original') {
          const deconstructedKey = objectKey.split('.')
          return useCaseSignURL(
            'getObject',
            `${deconstructedKey[0]}_${size}.png`,
          )
        }
      }
      return useCaseSignURL('getObject', objectKey)
    },
    async mimetype({ mimetype }, { target }, ctx) {
      if (mimetype.match(/^image\//)) {
        if (target && target === 'editor') {
          return 'image/png'
        }
      }
      return mimetype
    },
  },
  Subscription: {
    filesUploaded: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(FILES_UPLOADED)
      },
    },
    filesDeleted: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(FILES_DELETED)
      },
    },
    fileUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(FILE_UPDATED)
      },
    },
  },
}
