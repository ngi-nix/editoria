const logger = require('@pubsweet/logger')
const { pubsubManager } = require('pubsweet-server')
const { execSync } = require('child_process')

const pandocICMLHandler = enablePubsub => async job => {
  try {
    console.log('inside')
    const pubsub = await pubsubManager.getPubsub()

    logger.info(job.data.pubsubChannelIcml, 'has started.')
    pubsub.publish(job.data.pubsubChannelIcml, {
      pandocJob: {
        status: 'ICML creation started',
      },
    })

    execSync(
      `pandoc /temp/${job.data.path}/index.html -o /temp/${job.data.path}/index.icml`,
    )

    pubsub.publish(job.data.pubsubChannelIcml, {
      pandocJob: { status: 'ICML creation completed' },
    })

    return true
  } catch (e) {
    // eslint-disable-next-line

    const pubsub = await pubsubManager.getPubsub()
    pubsub.publish(job.data.pubsubChannelIcml, {
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
    console.log('begining')
  // Subscribe to the job queue with an async handler
  await jobQueue.subscribe('pandocICML', pandocICMLHandler(true))
}

handleJobs()
