const logger = require('@pubsweet/logger')
const { useCaseSignS3 } = require('../useCases')

const getSignedUrl = async (_, { input }, ctx) => {
  const { filename, fileType } = input
  try {
    logger.info('requesting a signed url from s3')
    return useCaseSignS3(filename, fileType)
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}
module.exports = {
  Mutation: {
    getSignedUrl,
  },
}
