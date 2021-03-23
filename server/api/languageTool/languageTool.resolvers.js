const fetch = require('node-fetch')
const { logger } = require('@coko/server')
const config = require('config')

const spellChecker = async (_, { language, text }, ctx) => {
  const languageConfig = config.get('language-tools')
  const { port, protocol, host } = languageConfig
  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`
  const messageData = await fetch(
    `${serverUrl}/v2/check?language=${language}&text=${text}`,
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
