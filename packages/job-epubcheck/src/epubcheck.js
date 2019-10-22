const logger = require('@pubsweet/logger')
const { pubsubManager } = require('pubsweet-server')
const epubchecker = require('epubchecker')

const epubcheckHandler = enablePubsub => async job => {
  try {
    const pubsub = await pubsubManager.getPubsub()

    logger.info(job.data.pubsubChannel, 'has started.')
    pubsub.publish(job.data.pubsubChannel, {
      epubcheckJob: {
        status: 'Validation started',
      },
    })

    const report = await epubchecker(`/epubs/${job.data.filename}`, {
      includeWarnings: true,
      // do not check CSS and font files
      exclude: /\.(css|ttf|opf|woff|woff2)$/,
    })

    pubsub.publish(job.data.pubsubChannel, {
      epubcheckJob: { report },
    })

    return report
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
    if (enablePubsub) {
      const pubsub = await pubsubManager.getPubsub()
      pubsub.publish(job.data.pubsubChannel, {
        epubcheckJob: { status: 'Validation Error', error: e },
      })
    }

    throw new Error('Validation error')
  }
}

const handleJobs = async () => {
  const {
    jobs: { connectToJobQueue },
  } = require('pubsweet-server')

  const jobQueue = await connectToJobQueue()

  // Subscribe to the job queue with an async handler
  await jobQueue.subscribe('epubcheck', epubcheckHandler(true))
}

handleJobs()
