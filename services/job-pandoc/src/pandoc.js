const logger = require('@pubsweet/logger')
const { pubsubManager } = require('pubsweet-server')
const { exec } = require('child_process')

const pandocICMLHandler = enablePubsub => async job => {
  try {
    const pubsub = await pubsubManager.getPubsub()

    logger.info(job.data.pubsubChannelIcml, 'has started.')
    pubsub.publish(job.data.pubsubChannelIcml, {
      pandocJob: {
        status: 'ICML creation started',
      },
    })

    await new Promise((resolve, reject) => {
      exec(
        `pandoc -s /uploads/temp/${job.data.filepath}/index.html -o /uploads/temp/${job.data.filepath}/index.icml`,
        (error, stdout, stderr) => {
          if (error) {
            return reject(error)
          }
          return resolve(stdout || stderr)
        },
      )
    })

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
  // console.log('begining', jobQueue)
  // Subscribe to the job queue with an async handler
  await jobQueue.subscribe('pandoc', pandocICMLHandler(true))
}

handleJobs()
