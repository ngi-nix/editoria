const fs = require('fs-extra')
const config = require('config')
const get = require('lodash/get')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')
const crypto = require('crypto')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const {
  ServiceCredential,
  ServiceCallbackToken,
} = require('../../data-model/src').models
const {
  saveDataLocally,
  writeLocallyFromReadStream,
  zipper,
} = require('../helpers/utils')
const {
  uploadFile,
  signURL,
  deleteFiles,
} = require('../useCases/objectStorage')

// CONSTS
const EPUBCHECKER = 'epub-checker'
const ICML = 'icml'
const PAGEDJS = 'pagedjs'
const XSWEET = 'xsweet'

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
        await ServiceCredential.query()
          .patch({
            accessToken,
          })
          .where({ name: which })
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

const epubcheckerHandler = async epubPath => {
  const serviceCredential = await ServiceCredential.query().where({
    name: EPUBCHECKER,
  })
  if (serviceCredential.length === 0) {
    throw new Error(`no service credentials for service ${EPUBCHECKER}`)
  }
  const { accessToken } = serviceCredential[0]
  if (!accessToken) {
    await serviceHandshake(EPUBCHECKER)
  }
  const service = get(services, EPUBCHECKER)
  const { port, protocol, host } = service
  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`
  const deconstruct = epubPath.split('/')
  const epubName = deconstruct[deconstruct.length - 1]
  const { original } = await uploadFile(
    fs.createReadStream(epubPath),
    epubName,
    'application/epub+zip',
  )
  const EPUBPath = await signURL('getObject', original.key)

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/epubchecker/link`,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      data: { EPUBPath },
    })
      .then(async ({ data }) => {
        await deleteFiles([original.key])
        resolve(data)
      })
      .catch(async err => {
        await deleteFiles([original.key])
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }
        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          await serviceHandshake(EPUBCHECKER)
          return epubcheckerHandler(epubPath)
        }
        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}
const icmlHandler = async icmlTempPath => {
  const serviceCredential = await ServiceCredential.query().where({
    name: ICML,
  })
  if (serviceCredential.length === 0) {
    throw new Error(`no service credentials for service ${ICML}`)
  }
  const { accessToken } = serviceCredential[0]
  if (!accessToken) {
    await serviceHandshake(ICML)
  }
  const service = get(services, ICML)
  const { port, protocol, host } = service
  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`

  const form = new FormData()
  form.append('html', fs.createReadStream(`${icmlTempPath}/index.html`))

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/htmlToICML`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...form.getHeaders(),
      },
      data: form,
    })
      .then(async res => {
        await saveDataLocally(icmlTempPath, 'index.icml', res.data, 'utf-8')
        resolve()
      })
      .catch(async err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }

        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          await serviceHandshake(ICML)
          return icmlHandler(icmlTempPath)
        }

        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}

const pdfHandler = async (zipPath, outputPath, filename) => {
  const serviceCredential = await ServiceCredential.query().where({
    name: PAGEDJS,
  })
  if (serviceCredential.length === 0) {
    throw new Error(`no service credentials for service ${PAGEDJS}`)
  }
  const { accessToken } = serviceCredential[0]
  if (!accessToken) {
    await serviceHandshake(PAGEDJS)
  }
  const service = get(services, PAGEDJS)
  const { port, protocol, host } = service
  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`

  const form = new FormData()
  form.append('zip', fs.createReadStream(`${zipPath}`))

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/htmlToPDF`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...form.getHeaders(),
      },
      responseType: 'stream',
      data: form,
    })
      .then(async res => {
        await writeLocallyFromReadStream(
          outputPath,
          filename,
          res.data,
          'binary',
        )
        resolve()
      })
      .catch(async err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }

        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          await serviceHandshake(PAGEDJS)
          return pdfHandler(zipPath, outputPath, filename)
        }

        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}

const xsweetHandler = async (bookComponentId, filePath) => {
  try {
    const serviceCredential = await ServiceCredential.query().where({
      name: XSWEET,
    })
    if (serviceCredential.length === 0) {
      throw new Error(`no service credentials for service ${XSWEET}`)
    }
    const { accessToken, id } = serviceCredential[0]
    if (!accessToken) {
      await serviceHandshake(XSWEET)
    }
    const service = get(services, XSWEET)
    const { port, protocol, host } = service
    const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`

    const form = new FormData()
    form.append('docx', fs.createReadStream(filePath))
    form.append('serviceCredentialId', id)
    form.append('bookComponentId', bookComponentId)
    const serviceCallbackToken = await ServiceCallbackToken.query().insert({
      bookComponentId,
      serviceCredentialId: id,
      responseToken: crypto.randomBytes(32).toString('hex'),
    })
    const { responseToken, id: serviceCallbackTokenId } = serviceCallbackToken
    form.append('responseToken', responseToken)
    form.append('serviceCallbackTokenId', serviceCallbackTokenId)
    const servesClient = config.get('pubsweet-server.servesClient')
    const externalServerURL = config.get('pubsweet-server.externalServerURL')

    let url = config.get('pubsweet-server.baseUrl')

    if (servesClient === 'true') {
      if (externalServerURL && externalServerURL !== 'null') {
        url = externalServerURL
      }
    }
    form.append('callbackURL', url)

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `${serverUrl}/api/docxToHTML`,
        headers: {
          authorization: `Bearer ${accessToken}`,
          ...form.getHeaders(),
        },
        data: form,
      })
        .then(async ({ data }) => {
          const { msg } = data
          await fs.remove(filePath)
          resolve(msg)
        })
        .catch(async err => {
          const { response } = err
          if (!response) {
            return reject(new Error(`Request failed with message: ${err.code}`))
          }
          const { status, data } = response
          const { msg } = data
          if (status === 401 && msg === 'expired token') {
            // retry if expiration happened in the meantime
            await serviceHandshake(XSWEET)
            await fs.remove(filePath)
            return xsweetHandler(filePath)
          }

          return reject(
            new Error(
              `Request failed with status ${status} and message: ${msg}`,
            ),
          )
        })
    })
  } catch (e) {
    throw new Error(e)
  }
}

const pagedPreviewerLinkHandler = async dirPath => {
  const serviceCredential = await ServiceCredential.query().where({
    name: PAGEDJS,
  })
  if (serviceCredential.length === 0) {
    throw new Error(`no service credentials for service ${PAGEDJS}`)
  }
  const { accessToken } = serviceCredential[0]
  if (!accessToken) {
    await serviceHandshake(PAGEDJS)
  }
  const service = get(services, PAGEDJS)
  const { port, protocol, host } = service
  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`
  const zipPath = await zipper(
    path.join(`${process.cwd()}`, uploadsDir, 'paged', dirPath),
  )
  const form = new FormData()
  form.append('zip', fs.createReadStream(`${zipPath}`))

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/getPreviewerLink`,
      headers: {
        authorization: `Bearer ${accessToken}`,
        ...form.getHeaders(),
      },
      data: form,
    })
      .then(async ({ data }) => {
        await fs.remove(zipPath)
        resolve(data)
      })
      .catch(async err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }

        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          await serviceHandshake(PAGEDJS)
          return pagedPreviewerLinkHandler(dirPath)
        }
        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}
module.exports = {
  epubcheckerHandler,
  icmlHandler,
  xsweetHandler,
  pdfHandler,
  pagedPreviewerLinkHandler,
}
