const waait = require('waait')
const { db } = require('@pubsweet/db-manager')
const logger = require('@pubsweet/logger')

const cheerio = require('cheerio')
const find = require('lodash/find')

const { useCaseGetContentFiles } = require('../useCases')

const replaceImageSrc = async content => {
  const $ = cheerio.load(content)
  const fileIds = []

  $('img').each((i, elem) => {
    const $elem = $(elem)
    const fileId = $elem.attr('data-fileid')
    if (fileId) {
      fileIds.push(fileId)
    }
  })

  if (fileIds.length > 0) {
    const files = await useCaseGetContentFiles(fileIds)

    $('img').each((i, elem) => {
      const $elem = $(elem)
      const fileId = $elem.attr('data-fileid')

      const correspondingFile = find(files, { id: fileId })

      if (correspondingFile) {
        const { source, alt } = correspondingFile

        $elem.attr('src', source)
        if (alt) {
          $elem.attr('alt', alt)
        }
      } else {
        $elem.attr('src', '')
        $elem.attr('alt', '')
      }
    })
  }
  return $.html()
}

module.exports = {
  convertDocx: async (file, pubsubChannel, pubsub, jobQueue) => {
    // A reference to actual pgboss job row
    try {
      const { createReadStream, filename } = await file
      const stream = createReadStream()

      const fileStream = await new Promise((resolve, reject) => {
        const chunks = []

        stream.on('data', chunk => {
          chunks.push(chunk)
        })

        stream.on('end', () => {
          resolve(Buffer.concat(chunks))
        })

        stream.on('error', e => {
          reject(e)
        })
      })

      const queueJobId = await jobQueue.publish(`xsweetGraphQL`, {
        docx: {
          name: filename,
          data: fileStream.toString('base64'),
        },
        pubsubChannel,
      })

      return new Promise(async (resolve, reject) => {
        pubsub.subscribe(
          pubsubChannel,
          async ({ docxToHTMLJob: { status } }) => {
            logger.info(pubsubChannel, status)

            if (status === 'Conversion complete') {
              await waait(2000)
              const job = await db(
                'pgboss.job',
              ).whereRaw("data->'request'->>'id' = ?", [queueJobId])
              const content = job[0].data.response.html
              resolve(content)
            }

            if (status === 'Conversion error') {
              reject(new Error('Conversion error'))
            }
          },
        )
      })
    } catch (e) {
      logger.error(e.message)
      throw new Error(e)
    }
  },
  extractFragmentProperties: fileName => {
    const nameSpecifier = fileName.slice(0, 1)

    let label
    if (nameSpecifier === 'a') {
      label = 'Frontmatter'
    } else if (nameSpecifier === 'w') {
      label = 'Backmatter'
    } else {
      label = 'Body'
    }

    let componentType
    if (label !== 'Body') {
      componentType = 'component'
    } else if (fileName.includes('00')) {
      componentType = 'unnumbered'
    } else if (fileName.includes('pt0')) {
      componentType = 'part'
    } else {
      componentType = 'chapter'
    }

    return {
      label,
      componentType,
    }
  },
  replaceImageSrc,
}
