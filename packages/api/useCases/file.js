const pickBy = require('lodash/pickBy')
const map = require('lodash/map')
const { File, FileTranslation } = require('editoria-data-model/src').models
const logger = require('@pubsweet/logger')

const { deleteFiles: deleteRemoteFiles } = require('./objectStorage')

const createFile = async (
  { name, size, mimetype, tags, metadata, extension },
  { location, key },
  entityType,
  entityId,
  referenceId,
) => {
  try {
    const tempFile = {
      name: name.replace(/\.[^/.]+$/, ''), // strip the extension from the filename
      source: location,
      objectKey: key,
      size,
      metadata,
      extension,
      tags,
      mimetype,
      referenceId,
      bookId: entityType === 'book' ? entityId : undefined,
      templateId: entityType === 'template' ? entityId : undefined,
      bookComponentId: entityType === 'bookComponent' ? entityId : undefined,
    }

    const cleanedObject = pickBy(tempFile, v => v !== undefined)

    return File.query().insert(cleanedObject)
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateFile = async (id, data) => {
  try {
    const { name, alt } = data
    if (alt) {
      const fileTranslation = await FileTranslation.query().findOne({
        fileId: id,
        languageIso: 'en',
      })
      if (fileTranslation) {
        await FileTranslation.query().patchAndFetchById(fileTranslation.id, {
          alt,
        })
      } else {
        await FileTranslation.query().insert({
          fileId: id,
          languageIso: 'en',
          alt,
        })
      }

      return File.findById(id)
    }
    return File.query().patchAndFetchById(id, { name })
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const deleteFile = async (id, remoteToo = false) => {
  try {
    const deletedFile = await File.query().patchAndFetchById(id, {
      deleted: true,
    })
    const { id: deletedId, mimetype, objectKey } = deletedFile

    if (remoteToo) {
      const keys = []
      keys.push(objectKey)
      if (mimetype.match(/^image\//)) {
        const keyDeconstructed = objectKey.split('.')[0]
        keys.push(
          `${keyDeconstructed}_small.png`,
          `${keyDeconstructed}_medium.png`,
        )
      }
      await deleteRemoteFiles(keys)
    }
    return deletedId
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const deleteFiles = async (ids, remoteToo = false) => {
  try {
    await File.query()
      .patch({ deleted: true })
      .whereIn('id', ids)
    const deletedFiles = await File.query().whereIn('id', ids)
    if (remoteToo) {
      await Promise.all(
        map(deletedFiles, async deletedFile => {
          const { mimetype, objectKey } = deletedFile
          const keys = []
          keys.push(objectKey)
          if (mimetype.match(/^image\//)) {
            const keyDeconstructed = objectKey.split('.')[0]
            keys.push(
              `${keyDeconstructed}_small.png`,
              `${keyDeconstructed}_medium.png`,
            )
          }
          await deleteRemoteFiles(keys)
        }),
      )
    }
    return map(deletedFiles, file => file.id)
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const getEntityFiles = async (
  entityId,
  entityType,
  orderParams = undefined,
) => {
  try {
    if (orderParams) {
      const orderByParams = orderParams.map(option => {
        const { key, order } = option
        return { column: key, order }
      })

      return File.query()
        .where({ [`${entityType}Id`]: entityId })
        .andWhere({ deleted: false })
        .orderBy(orderByParams)
    }
    return File.query()
      .where({ [`${entityType}Id`]: entityId })
      .andWhere({ deleted: false })
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const getFiles = async () => {
  try {
    return File.query().where({ deleted: false })
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const getSpecificFiles = async ids => {
  try {
    const file = await File.query()
      .whereIn('id', ids)
      .andWhere({ deleted: false })

    return file
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const getFile = async id => {
  try {
    const file = await File.findById(id)
    if (file.deleted) {
      throw new Error('file does not exists')
    }
    return file
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

module.exports = {
  createFile,
  updateFile,
  deleteFile,
  deleteFiles,
  getEntityFiles,
  getFiles,
  getSpecificFiles,
  getFile,
}
