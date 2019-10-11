const fetch = require('node-fetch')
const logger = require('@pubsweet/logger')

const spellChecker = async (_, { language, text }, ctx) => {
  const messageData = await fetch(
    `http://localhost:8010/v2/check?language=${language}&text=${text}`,
    {
      method: 'POST',
    },
  )
    .then(response => {
      if (response.status >= 400) {
        logger.error(response.statusText)
        throw new Error(response.statusText)
      }
      return response.json()
    })
    .catch(e => {
      logger.error(e)
      throw new Error(e)
    })

  return messageData
}

module.exports = {
  Query: {
    spellChecker,
  },
}
