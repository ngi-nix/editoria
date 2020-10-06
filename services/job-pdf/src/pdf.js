const logger = require('@pubsweet/logger')
const { pubsubManager } = require('pubsweet-server')
const { exec } = require('child_process')
const path = require('path')

const pdfHandler = enablePubsub => async job => {
  try {
    const pubsub = await pubsubManager.getPubsub()

    logger.info(job.data.pubsubChannelPdf, 'has started.')
    pubsub.publish(job.data.pubsubChannelPdf, {
      pdfJob: {
        status: 'PDF creation started',
      },
    })
    const pagedCLI = path.join(
      `${process.cwd()}/`,
      'node_modules/pagedjs-cli/bin/paged -i',
    )
    await new Promise((resolve, reject) => {
      exec(
        `${pagedCLI} ${job.data.filePath} -o ${job.data.outputPath}`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error)
          }
          return resolve(stdout || stderr)
        },
      )
    })

    pubsub.publish(job.data.pubsubChannelPdf, {
      pdfJob: { status: 'PDF creation completed' },
    })

    return true
  } catch (e) {
    // eslint-disable-next-line
    const pubsub = await pubsubManager.getPubsub()
    pubsub.publish(job.data.pubsubChannelPdf, {
      pdfJob: { status: 'PDF creation error', error: e },
    })
    logger.error(e.message)
    throw new Error('PDF error', e)
  }
}

const handleJobs = async () => {
  const {
    jobs: { connectToJobQueue },
  } = require('pubsweet-server')

  const jobQueue = await connectToJobQueue()
  // console.log('begining', jobQueue)
  // Subscribe to the job queue with an async handler
  await jobQueue.subscribe('pdf', pdfHandler(true))
}

handleJobs()
