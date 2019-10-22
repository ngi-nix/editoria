const logger = require('@pubsweet/logger')
const { pubsubManager } = require('pubsweet-server')
const { execSync } = require('child_process')

const pandocICMLHandler = enablePubsub => async job => {
  try {
    const pubsub = await pubsubManager.getPubsub()

    logger.info(job.data.pubsubChannel, 'has started.')
    pubsub.publish(job.data.pubsubChannel, {
      pandocJob: {
        status: 'ICML creation started',
      },
    })

    execSync(
      `pandoc /icmls/${job.data.path}/index.html -o /icmls/${job.data.path}/index.icml`,
    )

    pubsub.publish(job.data.pubsubChannel, {
      pandocJob: { status: 'ICML creation completed' },
    })

    return true
  } catch (e) {
    // eslint-disable-next-line

    const pubsub = await pubsubManager.getPubsub()
    pubsub.publish(job.data.pubsubChannel, {
      pandocJob: { status: 'ICML creation error', error: e },
    })

    throw new Error('ICML error')
  }
}

const handleJobs = async () => {
  const {
    jobs: { connectToJobQueue },
  } = require('pubsweet-server')

  const jobQueue = await connectToJobQueue()

  // Subscribe to the job queue with an async handler
  await jobQueue.subscribe('pandocICML', pandocICMLHandler(true))
}

handleJobs()
