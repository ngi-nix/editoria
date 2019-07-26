const orderBy = require('lodash/orderBy')
const map = require('lodash/map')
const find = require('lodash/find')
const path = require('path')
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

const getTemplates = async (_, { ascending, sortKey }, ctx) => {
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
const getTemplate = async (_, { id }, ctx) => Template.findById(id)

const createTemplate = async (_, { input }, ctx) => {
  const { name, author, files, target, trimSize, thumbnail } = input

  // const allowedFonts = ['.otf', '.woff', '.woff2']
  const allowedThumbnails = ['.png', '.jpg', '.jpeg']
  const allowedFiles = ['.css', '.otf', '.woff', '.woff2']
  const regexFiles = new RegExp(
    '([a-zA-Z0-9s_\\.-:])+(' + allowedFiles.join('|') + ')$',
  )

  const regexThumbnails = new RegExp(
    '([a-zA-Z0-9s_\\.-:])+(' + allowedThumbnails.join('|') + ')$',
  )

  try {
    const pubsub = await pubsubManager.getPubsub()
    logger.info('About to create a new template')
    const newTemplate = await new Template({
      name,
      author,
      target,
      trimSize,
    }).save()
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
          stream.pipe(
            outStream,
            { encoding },
          )
          outStream.on('error', () => {
            throw new Error('Unable to write file')
          })
          return new Promise((resolve, reject) => {
            stream.on('end', async () => {
              try {
                logger.info('File uploaded to server')
                const newFile = await new File({
                  filename,
                  mimetype,
                  source: outPath,
                  templateId: newTemplate.id,
                }).save()
                logger.info(
                  `File representation created on the db with file id ${
                    newFile.id
                  }`,
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

        stream.pipe(
          outStream,
          { encoding },
        )
        outStream.on('error', () => {
          throw new Error('Unable to write file')
        })

        stream.on('end', async () => {
          try {
            logger.info('Thumbnail uploaded to the server')
            const newThumbnail = await new File({
              filename,
              mimetype,
              source: outPath,
              templateId: newTemplate.id,
            }).save()
            logger.info(
              `Thumbnail representation created on the db with file id ${
                newThumbnail.id
              }`,
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

// TODO:
const updateTemplate = async (_, {}, ctx) => {}

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
    const templatePath = path.join(uploadsPath, 'templates', toBeDeleted.id)

    logger.info(
      `${
        files.length
      } associated files should be patched with deleted set to true`,
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

module.exports = {
  Query: {
    getTemplates,
    getTemplate,
  },
  Mutation: {
    createTemplate,
    updateTemplate,
    deleteTemplate,
  },
  Template: {
    async files(template, _, ctx) {
      return template.getFiles()
    },
    async thumbnail(template, _, ctx) {
      return template.getThumbnail()
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
