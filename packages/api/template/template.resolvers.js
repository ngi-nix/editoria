const orderBy = require('lodash/orderBy')
const map = require('lodash/map')
const find = require('lodash/find')
const clone = require('lodash/clone')
const path = require('path')
const fs = require('fs-extra')
const config = require('config')

const uploadsPath = config.get('pubsweet-server').uploads
const {
  Template,
  File,
  FileTranslation,
} = require('editoria-data-model/src').models

// const pubsweetServer = require('pubsweet-server')

// const { pubsubManager } = pubsweetServer
const getTemplates = async (_, { ascending, sortKey }, ctx) => {
  const templates = await Template.query().where('deleted', false)

  const order = ascending ? 'asc' : 'desc'

  const sorted = orderBy(templates, sortKey, [order])
  const result = map(sorted, item => find(templates, { id: item.id }))
  return result
}
const getTemplate = async (_, { id }, ctx) => Template.query().findById(id)

const createTemplate = async (_, { input }, ctx) => {
  const { templateName, author, files, target } = input

  const allowedFonts = ['.otf', '.woff', '.woff2']
  const allowedFiles = ['.css', '.otf', '.woff', '.woff2']
  const regex = new RegExp(
    '([a-zA-Z0-9s_\\.-:])+(' + allowedFiles.join('|') + ')$',
  )

  try {
    const newTemplate = await new Template({
      templateName,
      author,
      target,
      files: [],
    }).save()

    await Promise.all(
      map(files, async file => {
        const { createReadStream, filename, mimetype, encoding } = await file
        if (!regex.test(filename))
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
        return new Promise((resolve, reject) => {
          stream.on('end', async () => {
            try {
              await new File({
                filename,
                mimetype,
                source: outPath,
                templateId: newTemplate.id,
              }).save()
              resolve()
            } catch (e) {
              throw new Error(e)
            }
          })
          stream.on('error', reject)
        })
      }),
    )
    return newTemplate
  } catch (e) {
    throw new Error(e)
  }
}

const updateTemplate = async (_, {}, ctx) => {}
const deleteTemplate = async (_, {}, ctx) => {}

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
      const temp = await Template.findById(template.id)
      return temp.getFiles()
    },
  },
  Subscription: {},
}
