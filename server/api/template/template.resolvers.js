const orderBy = require('lodash/orderBy')
const map = require('lodash/map')
const find = require('lodash/find')

const path = require('path')
const crypto = require('crypto')

const { writeFileSync, createReadStream } = require('fs')
const fs = require('fs-extra')
const config = require('config')
const logger = require('@pubsweet/logger')
const mime = require('mime-types')

const uploadsPath = config.get('pubsweet-server').uploads
const { Template, File } = require('../../data-model/src').models

const { mimetypeHelpers } = require('../../../app/components/common')

const { isSupportedAsset } = mimetypeHelpers

const pubsweetServer = require('pubsweet-server')

const { pubsubManager } = pubsweetServer

const {
  TEMPLATE_CREATED,
  TEMPLATE_DELETED,
  TEMPLATE_UPDATED,
} = require('./consts')

const {
  useCaseUploadFile,
  useCaseCreateFile,
  useCaseFetchRemoteFileLocally,
} = require('../useCases')

const exporter = require('../book/utils/exporter')

const getTemplates = async (_, { ascending, sortKey, target, notes }, ctx) => {
  try {
    if (!target) {
      const templates = await Template.query().where('deleted', false)
      const sortable = map(templates, template => {
        const { id, name, author, target } = template
        return { id, name: name.toLowerCase().trim(), author, target }
      })

      const order = ascending ? 'asc' : 'desc'

      const sorted = orderBy(sortable, sortKey, [order])
      const result = map(sorted, item => find(templates, { id: item.id }))
      return result
    }
    if (notes && notes === 'endnotes') {
      return Template.query()
        .where('deleted', false)
        .andWhere('target', target)
        .andWhere('notes', notes)
    }
    return Template.query()
      .where('deleted', false)
      .andWhere('target', target)
      .whereNot('notes', 'endnotes')
  } catch (e) {
    throw new Error(e)
  }
}
const getTemplate = async (_, { id }, ctx) => {
  const template = await Template.findById(id)

  return template
}

const createTemplate = async (_, { input }, ctx) => {
  const { name, author, files, target, trimSize, thumbnail, notes } = input

  try {
    const pubsub = await pubsubManager.getPubsub()
    logger.info('About to create a new template')
    const newTemplate = await Template.query().insert({
      name,
      author,
      target,
      notes,
      trimSize,
    })
    logger.info(`New template created with id ${newTemplate.id}`)
    if (files.length > 0) {
      logger.info(
        `There is/are ${files.length} file/s to be uploaded for the template`,
      )
      await Promise.all(
        map(files, async file => {
          const { createReadStream, filename, encoding } = await file
          const mimetype = mime.lookup(filename)
          if (!isSupportedAsset(mimetype, 'templates'))
            throw new Error('File extension is not allowed')
          const fileStream = createReadStream()
          const { original } = await useCaseUploadFile(
            fileStream,
            filename,
            mimetype,
            encoding,
            `templates/${newTemplate.id}/${filename}`,
          )
          const { key, location, metadata, size, extension } = original
          return useCaseCreateFile(
            { name: filename, size, mimetype, metadata, extension },
            { location, key },
            'template',
            newTemplate.id,
          )
        }),
      )
    }
    if (thumbnail) {
      logger.info('There is a thumbnail file to be uploaded for the template')
      const { createReadStream, filename, encoding } = await thumbnail
      const mimetype = mime.lookup(filename)
      if (!isSupportedAsset(mimetype, 'templateThumbnails'))
        throw new Error('File extension is not allowed')
      const fileStream = createReadStream()
      const { original } = await useCaseUploadFile(
        fileStream,
        filename,
        mimetype,
        encoding,
      )
      logger.info('Thumbnail uploaded to the server')
      const { key, location, metadata, size, extension } = original
      const newThumbnail = await useCaseCreateFile(
        { name: filename, size, mimetype, metadata, extension },
        { location, key },
        'template',
        newTemplate.id,
      )
      logger.info(
        `Thumbnail representation created on the db with file id ${newThumbnail.id}`,
      )
      await Template.query()
        .patch({ thumbnailId: newThumbnail.id })
        .findById(newTemplate.id)
    }
    pubsub.publish(TEMPLATE_CREATED, {
      templateCreated: newTemplate,
    })
    logger.info('New template created msg broadcasted')
    return newTemplate
  } catch (e) {
    throw new Error(e)
  }
}

const cloneTemplate = async (_, { input }, ctx) => {
  try {
    const { id, bookId, name, cssFile, hashed } = input
    const pubsub = await pubsubManager.getPubsub()
    const randomHash = crypto.randomBytes(16).toString('hex')
    const tempFolder = `${uploadsPath}/temp/${randomHash}`

    await fs.ensureDir(uploadsPath)
    await fs.ensureDir(tempFolder)

    const template = await Template.query().findById(id)

    const newTemplate = await Template.query().insert({
      name,
      author: template.author,
      target: template.target,
      trimSize: template.trimSize,
      notes: template.notes,
      referenceId: template.id,
    })

    logger.info(`New template created with id ${newTemplate.id}`)
    let updateTemplate = newTemplate
    const files = await File.query()
      .where('templateId', id)
      .andWhere({ deleted: false })

    await Promise.all(
      map(files, async file => {
        const { objectKey, name, mimetype, extension } = file
        const filepath = path.join(tempFolder, `${name}.${extension}`)

        if (mimetype === 'text/css') {
          writeFileSync(filepath, cssFile)
        } else {
          await useCaseFetchRemoteFileLocally(objectKey, filepath)
        }

        const fileStream = createReadStream(filepath)
        const { original } = await useCaseUploadFile(
          fileStream,
          `${name}.${extension}`,
          mimetype,
          undefined,
          `templates/${newTemplate.id}/${name}.${extension}`,
        )
        const { key, location, metadata, size } = original
        const newFile = await useCaseCreateFile(
          { name: `${name}.${extension}`, size, mimetype, metadata, extension },
          { location, key },
          'template',
          newTemplate.id,
        )
        logger.info(`The path the the files will be stored is ${filepath}`)
        logger.info(
          `File representation created on the db with file id ${newFile.id}`,
        )
        if (template.thumbnailId === file.id) {
          updateTemplate = await Template.query().patchAndFetchById(
            newTemplate.id,
            { thumbnailId: newFile.id },
          )
        }
      }),
    )
    await fs.remove(tempFolder)
    pubsub.publish(TEMPLATE_CREATED, {
      templateCreated: updateTemplate,
    })
    logger.info('New template created msg broadcasted')
    await fs.remove(`${uploadsPath}/paged/${hashed}`)
    return exporter(
      bookId,
      'preview',
      newTemplate.id,
      'pagedjs',
      undefined,
      newTemplate.notes,
      ctx,
    )
  } catch (e) {
    throw new Error(e)
  }
}

const updateTemplate = async (_, { input }, ctx) => {
  const {
    id,
    name,
    author,
    files,
    target,
    trimSize,
    notes,
    thumbnail,
    deleteFiles,
    deleteThumbnail,
  } = input

  try {
    const pubsub = await pubsubManager.getPubsub()
    if (deleteThumbnail) {
      logger.info(
        `Existing thumbnail with id ${deleteThumbnail} will be patched and set to deleted true`,
      )
      const deletedThumbnail = await File.query().patchAndFetchById(
        deleteThumbnail,
        { deleted: true },
      )
      logger.info(`File with id ${deletedThumbnail.id} was patched`)
      await Template.query()
        .patch({ thumbnailId: null })
        .findById(id)
      logger.info('Template thumbnailId property updated')
    }
    if (deleteFiles.length > 0) {
      logger.info(
        `Existing file/s with id/s ${deleteFiles} will be patched and set to deleted true`,
      )
      await Promise.all(
        map(deleteFiles, async fileId => {
          const deletedFile = await File.query().patchAndFetchById(fileId, {
            deleted: true,
          })
          logger.info(`File with id ${deletedFile.id} was patched`)
        }),
      )
    }

    if (files.length > 0) {
      logger.info(
        `There is/are ${files.length} new file/s to be uploaded for the template`,
      )

      await Promise.all(
        map(files, async file => {
          const { createReadStream, filename, encoding } = await file
          const mimetype = mime.lookup(filename)
          if (!isSupportedAsset(mimetype, 'templates'))
            throw new Error('File extension is not allowed')
          const fileStream = createReadStream()
          const { original } = await useCaseUploadFile(
            fileStream,
            filename,
            mimetype,
            encoding,
            `templates/${id}/${filename}`,
          )
          const { key, location, metadata, size, extension } = original
          return useCaseCreateFile(
            { name: filename, size, mimetype, metadata, extension },
            { location, key },
            'template',
            id,
          )
        }),
      )
    }

    if (thumbnail) {
      logger.info(
        'There is a new thumbnail file to be uploaded for the template',
      )

      const { createReadStream, filename, encoding } = await thumbnail
      const mimetype = mime.lookup(filename)
      if (!isSupportedAsset(mimetype, 'templateThumbnails'))
        throw new Error('File extension is not allowed')
      const fileStream = createReadStream()
      const { original } = await useCaseUploadFile(
        fileStream,
        filename,
        mimetype,
        encoding,
      )
      logger.info('Thumbnail uploaded to the server')
      const { key, location, metadata, size, extension } = original
      const newThumbnail = await useCaseCreateFile(
        { name: filename, size, mimetype, metadata, extension },
        { location, key },
        'template',
        id,
      )
      logger.info(
        `Thumbnail representation created on the db with file id ${newThumbnail.id}`,
      )
      await Template.query()
        .patch({ thumbnailId: newThumbnail.id })
        .findById(id)
    }

    const updatedTemplate = await Template.query().patchAndFetchById(id, {
      name,
      author,
      trimSize,
      target,
      notes,
    })
    pubsub.publish(TEMPLATE_UPDATED, {
      templateUpdated: updatedTemplate,
    })
    logger.info('Template updated msg broadcasted')
    return updatedTemplate
  } catch (e) {
    throw new Error(e)
  }
}

const deleteTemplate = async (_, { id }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const toBeDeleted = await Template.query().patchAndFetchById(id, {
      deleted: true,
    })
    logger.info(
      `Template with id ${toBeDeleted.id} patched with deleted set to true`,
    )
    const files = await toBeDeleted.getFiles()
    const thumbnail = await toBeDeleted.getThumbnail()

    if (thumbnail) {
      const deletedThumbnail = await File.query().patchAndFetchById(
        thumbnail.id,
        {
          deleted: true,
        },
      )
      logger.info(
        `Thumbnail with id ${deletedThumbnail.id} patched with deleted set to true`,
      )
    }

    logger.info(
      `${files.length} associated files should be patched with deleted set to true`,
    )
    await Promise.all(
      map(files, async file => {
        try {
          const deletedFile = await File.query().patchAndFetchById(file.id, {
            deleted: true,
          })
          logger.info(
            `File with id ${deletedFile.id} patched with deleted set to true`,
          )
          return deletedFile
        } catch (e) {
          throw new Error(e)
        }
      }),
    )

    pubsub.publish(TEMPLATE_DELETED, {
      templateDeleted: toBeDeleted,
    })
    logger.info('Template deleted msg broadcasted')
    return id
  } catch (e) {
    throw new Error(e)
  }
}

const updateTemplateCSSFile = async (_, { input }, ctx) => {
  try {
    const { id, data, hashed, bookId } = input
    const oldFile = await File.query().patchAndFetchById(id, { deleted: true })
    const { mimetype, name, extension, templateId } = oldFile
    const pubsub = await pubsubManager.getPubsub()

    fs.writeFileSync(
      path.join(uploadsPath, 'paged', hashed, `${name}.${extension}`),
      data,
    )

    const fileStream = createReadStream(
      path.join(uploadsPath, 'paged', hashed, `${name}.${extension}`),
    )
    const { original } = await useCaseUploadFile(
      fileStream,
      `${name}.${extension}`,
      mimetype,
      undefined,
      `templates/${templateId}/${name}.${extension}`,
    )
    const { key, location, metadata, size } = original
    await useCaseCreateFile(
      { name: `${name}.${extension}`, size, mimetype, metadata, extension },
      { location, key },
      'template',
      templateId,
    )
    await fs.remove(path.join(uploadsPath, 'paged', hashed))
    const currentTemplate = await Template.findById(templateId)
    pubsub.publish(TEMPLATE_UPDATED, {
      templateUpdated: currentTemplate,
    })
    logger.info('Template updated msg broadcasted')
    return exporter(
      bookId,
      'preview',
      currentTemplate.id,
      'pagedjs',
      undefined,
      currentTemplate.notes,
      ctx,
    )
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  Query: {
    getTemplates,
    getTemplate,
  },
  Mutation: {
    createTemplate,
    cloneTemplate,
    updateTemplate,
    updateTemplateCSSFile,
    deleteTemplate,
  },
  Template: {
    async files(template, _, ctx) {
      const files = await template.getFiles()
      return files
    },
    async thumbnail(template, _, ctx) {
      const thumbnail = await template.getThumbnail()
      return thumbnail
    },
  },
  Subscription: {
    templateCreated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(TEMPLATE_CREATED)
      },
    },
    templateDeleted: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(TEMPLATE_DELETED)
      },
    },
    templateUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(TEMPLATE_UPDATED)
      },
    },
  },
}
