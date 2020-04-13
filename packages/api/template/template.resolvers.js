const orderBy = require('lodash/orderBy')
const map = require('lodash/map')
const find = require('lodash/find')
const isUndefined = require('lodash/isUndefined')
const omitBy = require('lodash/omitBy')
const path = require('path')
const { copyFileSync, writeFileSync } = require('fs')
const fs = require('fs-extra')
const config = require('config')

const logger = require('@pubsweet/logger')

const uploadsPath = config.get('pubsweet-server').uploads
const { Template, File } = require('editoria-data-model/src').models

const pubsweetServer = require('pubsweet-server')

const { pubsubManager } = pubsweetServer

const {
  TEMPLATE_CREATED,
  TEMPLATE_DELETED,
  TEMPLATE_UPDATED,
} = require('./consts')

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

  // const allowedFonts = ['.otf', '.woff', '.woff2']
  const allowedThumbnails = ['.png', '.jpg', '.jpeg']
  const allowedFiles = ['.css', '.otf', '.woff', '.woff2', '.ttf']
  const regexFiles = new RegExp(
    `([a-zA-Z0-9s_\\.-:])+(${allowedFiles.join('|')})$`,
  )

  const regexThumbnails = new RegExp(
    `([a-zA-Z0-9s_\\.-:])+(${allowedThumbnails.join('|')})$`,
  )

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
          const { createReadStream, filename, mimetype, encoding } = await file
          if (!regexFiles.test(filename))
            throw new Error('File extension is not allowed')
          const outPath = path.join(
            uploadsPath,
            'templates',
            newTemplate.id,
            filename,
          )

          await fs.ensureDir(uploadsPath)
          await fs.ensureDir(`${uploadsPath}/templates`)
          await fs.ensureDir(`${uploadsPath}/templates/${newTemplate.id}`)
          logger.info(`The path the the files will be stored is ${outPath}`)
          const outStream = fs.createWriteStream(outPath)
          const stream = createReadStream()
          stream.pipe(outStream, { encoding })
          outStream.on('error', () => {
            throw new Error('Unable to write file')
          })
          return new Promise((resolve, reject) => {
            stream.on('end', async () => {
              try {
                logger.info('File uploaded to server')
                const newFile = await File.query().insert({
                  name: filename,
                  mimetype,
                  source: outPath,
                  templateId: newTemplate.id,
                })
                logger.info(
                  `File representation created on the db with file id ${newFile.id}`,
                )
                resolve()
              } catch (e) {
                throw new Error(e)
              }
            })
            stream.on('error', reject)
          })
        }),
      )
    }
    if (thumbnail) {
      logger.info('There is a thumbnail file to be uploaded for the template')
      await new Promise(async (resolve, reject) => {
        const {
          createReadStream,
          filename,
          mimetype,
          encoding,
        } = await thumbnail

        if (!regexThumbnails.test(filename))
          throw new Error('File extension is not allowed')
        const outPath = path.join(
          uploadsPath,
          'templates',
          newTemplate.id,
          filename,
        )

        await fs.ensureDir(uploadsPath)
        await fs.ensureDir(`${uploadsPath}/templates`)
        await fs.ensureDir(`${uploadsPath}/templates/${newTemplate.id}`)
        const outStream = fs.createWriteStream(outPath)
        const stream = createReadStream()

        stream.pipe(outStream, { encoding })
        outStream.on('error', () => {
          throw new Error('Unable to write file')
        })

        stream.on('end', async () => {
          try {
            logger.info('Thumbnail uploaded to the server')
            const newThumbnail = await File.query().insert({
              name: filename,
              mimetype,
              source: outPath,
              templateId: newTemplate.id,
            })
            logger.info(
              `Thumbnail representation created on the db with file id ${newThumbnail.id}`,
            )
            await Template.query()
              .patch({ thumbnailId: newThumbnail.id })
              .findById(newTemplate.id)
            logger.info('Template thumbnailId property updated')
            resolve()
          } catch (e) {
            throw new Error(e)
          }
        })
        stream.on('error', reject)
      })
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
  const { id, bookId, name, cssFile, hashed } = input
  const pubsub = await pubsubManager.getPubsub()

  try {
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
    const files = await File.query().where('templateId', id)
    await Promise.all(
      map(files, async file => {
        const outPath = path.join(
          uploadsPath,
          'templates',
          newTemplate.id,
          file.name,
        )

        await fs.ensureDir(uploadsPath)
        await fs.ensureDir(`${uploadsPath}/templates`)
        await fs.ensureDir(`${uploadsPath}/templates/${newTemplate.id}`)

        if (file.mimetype === 'text/css') {
          writeFileSync(outPath, cssFile)
          // writeFileSync(
          //   path.join(uploadsPath, 'paged', hashed, file.name),
          //   cssFile,
          // )
        } else {
          copyFileSync(file.source, outPath)
        }
        logger.info(`The path the the files will be stored is ${outPath}`)

        const newFile = await File.query().insert(
          Object.assign({
            source: outPath,
            templateId: newTemplate.id,
            name: file.name,
            mimetype: file.mimetype,
          }),
        )
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

    pubsub.publish(TEMPLATE_CREATED, {
      templateCreated: updateTemplate,
    })
    logger.info('New template created msg broadcasted')
    return exporter(
      bookId,
      'preview',
      newTemplate.id,
      'pagedjs',
      undefined,
      newTemplate.notes,
      ctx,
    )
    // updateTemplate.clonedPath = clonedPath
    // return updateTemplate
  } catch (e) {
    throw new Error(e)
  }
}

// TODO:
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

  // const allowedFonts = ['.otf', '.woff', '.woff2']
  const allowedThumbnails = ['.png', '.jpg', '.jpeg']
  const allowedFiles = ['.css', '.otf', '.woff', '.woff2', '.ttf']
  const regexFiles = new RegExp(
    `([a-zA-Z0-9s_\\.-:])+(${allowedFiles.join('|')})$`,
  )

  const regexThumbnails = new RegExp(
    `([a-zA-Z0-9s_\\.-:])+(${allowedThumbnails.join('|')})$`,
  )

  try {
    const pubsub = await pubsubManager.getPubsub()
    if (files.length > 0) {
      logger.info(
        `There is/are ${files.length} new file/s to be uploaded for the template`,
      )

      if (deleteFiles) {
        logger.info(
          `Existing file/s with id/s ${deleteFiles} will be patched and set to deleted true`,
        )
        await Promise.all(
          map(deleteFiles, async fileId => {
            const deletedFile = await File.query().patchAndFetchById(fileId, {
              deleted: true,
            })
            logger.info(`File with id ${deletedFile.id} was patched`)
            const thumbnailPath = path.join(
              uploadsPath,
              'templates',
              id,
              deletedFile.name,
            )
            await fs.remove(thumbnailPath)
            logger.info(
              `File with name ${deletedFile.name} removed from the server`,
            )
          }),
        )
      }

      if (deleteThumbnail) {
        logger.info(
          `Existing thumbnail with id ${deleteThumbnail} will be patched and set to deleted true`,
        )
        const deletedThumbnail = await File.query().patchAndFetchById(
          deleteThumbnail,
          { deleted: true },
        )
        logger.info(`File with id ${deletedThumbnail.id} was patched`)
        const thumbnailPath = path.join(
          uploadsPath,
          'templates',
          id,
          deletedThumbnail.name,
        )
        await fs.remove(thumbnailPath)
        logger.info(
          `File with name ${deletedThumbnail.name} removed from the server`,
        )
        await Template.query()
          .patch({ thumbnailId: null })
          .findById(id)
        logger.info('Template thumbnailId property updated')
      }

      await Promise.all(
        map(files, async file => {
          const { createReadStream, filename, mimetype, encoding } = await file
          if (!regexFiles.test(filename))
            throw new Error('File extension is not allowed')
          const outPath = path.join(uploadsPath, 'templates', id, filename)

          await fs.ensureDir(uploadsPath)
          await fs.ensureDir(`${uploadsPath}/templates`)
          await fs.ensureDir(`${uploadsPath}/templates/${id}`)
          logger.info(`The path the the files will be stored is ${outPath}`)
          const outStream = fs.createWriteStream(outPath)
          const stream = createReadStream()
          stream.pipe(outStream, { encoding })
          outStream.on('error', () => {
            throw new Error('Unable to write file')
          })
          return new Promise((resolve, reject) => {
            stream.on('end', async () => {
              try {
                logger.info('File uploaded to server')
                const newFile = await File.query().insert({
                  name: filename,
                  mimetype,
                  source: outPath,
                  templateId: id,
                })
                logger.info(
                  `File representation created on the db with file id ${newFile.id}`,
                )
                resolve()
              } catch (e) {
                throw new Error(e)
              }
            })
            stream.on('error', reject)
          })
        }),
      )
    }

    if (thumbnail) {
      logger.info(
        'There is a new thumbnail file to be uploaded for the template',
      )
      await new Promise(async (resolve, reject) => {
        const {
          createReadStream,
          filename,
          mimetype,
          encoding,
        } = await thumbnail

        if (!regexThumbnails.test(filename))
          throw new Error('File extension is not allowed')
        const outPath = path.join(uploadsPath, 'templates', id, filename)

        await fs.ensureDir(uploadsPath)
        await fs.ensureDir(`${uploadsPath}/templates`)
        await fs.ensureDir(`${uploadsPath}/templates/${id}`)
        const outStream = fs.createWriteStream(outPath)
        const stream = createReadStream()

        stream.pipe(outStream, { encoding })
        outStream.on('error', () => {
          throw new Error('Unable to write file')
        })

        stream.on('end', async () => {
          try {
            logger.info('Thumbnail uploaded to the server')
            const newThumbnail = await File.query().insert({
              name: filename,
              mimetype,
              source: outPath,
              templateId: id,
            })
            logger.info(
              `Thumbnail representation created on the db with file id ${newThumbnail.id}`,
            )
            await Template.query()
              .patch({ thumbnailId: newThumbnail.id })
              .findById(id)
            logger.info('Template thumbnailId property updated')
            resolve()
          } catch (e) {
            throw new Error(e)
          }
        })
        stream.on('error', reject)
      })
    }

    // if (deleteFiles) {
    //   logger.info(
    //     `Existing file/s with id/s ${deleteFiles} will be patched and set to deleted true`,
    //   )
    //   await Promise.all(
    //     map(deleteFiles, async fileId => {
    //       const deletedFile = await File.query().patchAndFetchById(fileId, {
    //         deleted: true,
    //       })
    //       logger.info(`File with id ${deletedFile.id} was patched`)
    //       const thumbnailPath = path.join(
    //         uploadsPath,
    //         'templates',
    //         id,
    //         deletedFile.name,
    //       )
    //       await fs.remove(thumbnailPath)
    //       logger.info(
    //         `File with name ${deletedFile.name} removed from the server`,
    //       )
    //     }),
    //   )
    // }
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
    const templatePath = path.join(uploadsPath, 'templates', toBeDeleted.id)

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
    await fs.remove(templatePath)
    logger.info(`Files deleted from the server on patch ${templatePath}`)
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
    const { id, data, hashed, ...restFile } = input
    const result = omitBy(restFile, isUndefined)
    const currentFile = await File.query().patchAndFetchById(id, result)
    if (data) {
      fs.writeFileSync(currentFile.source, data)
      if (hashed) {
        fs.writeFileSync(
          path.join(uploadsPath, 'paged', hashed, currentFile.name),
          data,
        )
      }
    }

    return currentFile
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
