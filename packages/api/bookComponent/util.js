const waait = require('waait')
const { db } = require('@pubsweet/db-manager')
const logger = require('@pubsweet/logger')

module.exports = {
  convertDocx: async (file, pubsubChannel, pubsub, jobQueue) => {
    // A reference to actual pgboss job row
    const { createReadStream, filename } = await file
    const stream = createReadStream()
    let queueJobId
    const contentPromise = new Promise(async (resolve, reject) => {
      pubsub.subscribe(pubsubChannel, async ({ docxToHTMLJob: { status } }) => {
        logger.info(pubsubChannel, status)
        if (status === 'Conversion complete') {
          await waait(1000)
          const job = await db('pgboss.job').whereRaw(
            "data->'request'->>'id' = ?",
            [queueJobId],
          )
          const content = job[0].data.response.html
          resolve(content)
        }
      })

      const chunks = []

      await new Promise((resolve, reject) => {
        stream.on('data', chunk => {
          chunks.push(chunk)
        })

        stream.on('end', () => {
          const result = Buffer.concat(chunks)

          jobQueue
            .publish(`xsweetGraphQL`, {
              docx: {
                name: filename,
                data: result.toString('base64'),
              },
              pubsubChannel,
            })
            .then(id => (queueJobId = id))
          resolve()
        })

        stream.on('error', e => {
          pubsub.publish(pubsubChannel, {
            status: e,
          })
          reject(e)
        })
      })
    })
    return contentPromise
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
}
