const pickBy = require('lodash/pickBy')
const map = require('lodash/map')
const forEach = require('lodash/forEach')
const {
  File,
  FileTranslation,
  BookComponent,
  BookComponentTranslation,
} = require('editoria-data-model/src').models
const logger = require('@pubsweet/logger')

const { deleteFiles: deleteRemoteFiles, signURL } = require('./objectStorage')
const { imageFinder } = require('../helpers/utils')

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

const updateFiles = async (ids, data) => {
  try {
    return File.query()
      .patch(data)
      .whereIn(ids)
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
      throw new Error('this file is deleted')
    }

    return file
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const getFileURL = async (id, size = undefined) => {
  const file = await File.findById(id)

  if (file.deleted) {
    throw new Error('this file is deleted')
  }

  const { mimetype, objectKey } = file

  if (mimetype.match(/^image\//)) {
    if (size && size !== 'original') {
      const deconstructedKey = objectKey.split('.')
      return signURL('getObject', `${deconstructedKey[0]}_${size}.png`)
    }
  }
  return signURL('getObject', objectKey)
}

const getContentFiles = async fileIds => {
  try {
    const files = await getSpecificFiles(fileIds)
    return Promise.all(
      map(files, async file => {
        const { id, mimetype, objectKey } = file

        const translation = await FileTranslation.query().where({
          fileId: id,
          languageIso: 'en',
        })
        file.alt = translation.length === 1 ? translation[0].alt : null

        if (mimetype.match(/^image\//)) {
          file.mimetype = 'image/png'
          const deconstructedKey = objectKey.split('.')
          file.source = await signURL(
            'getObject',
            `${deconstructedKey[0]}_medium.png`,
          )
          return file
        }

        file.source = await signURL('getObject', objectKey)

        return file
      }),
    )
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const isFileInUse = async (bookId, fileId) => {
  try {
    const foundIn = []

    const bookComponentsOfBook = await BookComponent.query()
      .select('book_component.id', 'book_component_translation.content')
      .leftJoin(
        'book_component_translation',
        'book_component.id',
        'book_component_translation.book_component_id',
      )
      .where({
        'book_component.book_id': bookId,
        'book_component.deleted': false,
        languageIso: 'en',
      })

    forEach(bookComponentsOfBook, bookComponent => {
      const { content, id } = bookComponent
      if (imageFinder(content, fileId)) {
        foundIn.push(id)
      }
    })

    return foundIn
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}
module.exports = {
  createFile,
  updateFile,
  updateFiles,
  deleteFile,
  deleteFiles,
  getEntityFiles,
  getFiles,
  getSpecificFiles,
  getFile,
  getFileURL,
  getContentFiles,
  isFileInUse,
}
