const config = require('config')
const get = require('lodash/get')
const findIndex = require('lodash/findIndex')
const axios = require('axios')
const { startServer } = require('@coko/server')
const { ServiceCredential } = require('../server/data-model/src').models

const scripts = config.get('export.scripts')
const services = config.get('services')
const serviceHandshake = async which => {
  if (!services) {
    throw new Error('services are undefined')
  }
  const service = get(services, `${which}`)

  if (!service) {
    throw new Error(`service ${which} configuration is undefined `)
  }

  const { clientId, clientSecret, port, protocol, host } = service
  const buff = Buffer.from(`${clientId}:${clientSecret}`, 'utf8')
  const base64data = buff.toString('base64')

  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`
  const serviceHealthCheck = await axios({
    method: 'get',
    url: `${serverUrl}/healthcheck`,
  })
  const { data: healthCheckData } = serviceHealthCheck
  const { message } = healthCheckData
  if (message !== 'Coolio') {
    throw new Error(`service ${which} is down`)
  }
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/auth`,
      headers: { authorization: `Basic ${base64data}` },
    })
      .then(async ({ data }) => {
        const { accessToken } = data
        await ServiceCredential.query().insert({
          name: which,
          accessToken,
        })
        resolve()
      })
      .catch(err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }
        const { status, data } = response
        const { msg } = data
        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}

const init = async () => {
  try {
    await startServer()

    const serviceCredentials = await ServiceCredential.query()

    if (serviceCredentials.length < Object.keys(services).length) {
      const serviceNames = Object.keys(services)
      await Promise.all(
        serviceNames.map(name => {
          if (findIndex(serviceCredentials, { name }) === -1) {
            return serviceHandshake(name)
          }
          return false
        }),
      )
    }
    if (scripts && scripts.length > 0) {
      const errors = []
      for (let i = 0; i < scripts.length; i += 1) {
        for (let j = i + 1; j < scripts.length; j += 1) {
          if (
            scripts[i].label === scripts[j].label &&
            scripts[i].filename !== scripts[j].filename &&
            scripts[i].scope === scripts[j].scope
          ) {
            errors.push(
              `your have provided the same label (${scripts[i].label}) for two different scripts`,
            )
          }
          if (
            scripts[i].label === scripts[j].label &&
            scripts[i].filename === scripts[j].filename &&
            scripts[i].scope === scripts[j].scope
          ) {
            errors.push(
              `your have declared the script with label (${scripts[i].label}) twice`,
            )
          }
        }
      }
      if (errors.length !== 0) {
        throw new Error(errors)
      }
    }
  } catch (e) {
    throw new Error(e)
  }
}

init()
