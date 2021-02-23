const fs = require('fs-extra')
const config = require('config')
const get = require('lodash/get')
const path = require('path')
const axios = require('axios')
const FormData = require('form-data')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

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
const accessTokens = {
  'epub-checker': undefined,
  icml: undefined,
  pagedjs: undefined,
  xsweet: undefined,
}

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

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/auth`,
      headers: { authorization: `Basic ${base64data}` },
    })
      .then(({ data }) => {
        const { accessToken } = data
        accessTokens[which] = accessToken
        resolve(`${which} service handshake done`)
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
  if (!get(accessTokens, `${EPUBCHECKER}`)) {
    await serviceHandshake(EPUBCHECKER)
  }
  const service = get(services, EPUBCHECKER)
  const { port, protocol, host } = service
  const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`
  // const form = new FormData()
  const deconstruct = epubPath.split('/')
  const epubName = deconstruct[deconstruct.length - 1]
  const { original } = await uploadFile(
    fs.createReadStream(epubPath),
    epubName,
    'application/epub+zip',
  )
  const EPUBPath = await signURL('getObject', original.key)
  // form.append('epub', fs.createReadStream(epubPath))
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${serverUrl}/api/epubchecker/link`,
      headers: {
        authorization: `Bearer ${get(accessTokens, `${EPUBCHECKER}`)}`,
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
          accessTokens[EPUBCHECKER] = undefined
        }
        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
  // return new Promise((resolve, reject) => {
  //   axios({
  //     method: 'post',
  //     url: `${serverUrl}/api/epubchecker`,
  //     headers: {
  //       authorization: `Bearer ${get(accessTokens, `${EPUBCHECKER}`)}`,
  //       ...form.getHeaders(),
  //     },
  //     data: form,
  //   })
  //     .then(({ data }) => {
  //       resolve(data)
  //     })
  //     .catch(err => {
  //       const { response } = err
  //       if (!response) {
  //         return reject(new Error(`Request failed with message: ${err.code}`))
  //       }
  //       const { status, data } = response
  //       const { msg } = data
  //       if (status === 401 && msg === 'expired token') {
  //         accessTokens[EPUBCHECKER] = undefined
  //       }
  //       return reject(
  //         new Error(`Request failed with status ${status} and message: ${msg}`),
  //       )
  //     })
  // })
}
const icmlHandler = async icmlTempPath => {
  if (!get(accessTokens, `${ICML}`)) {
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
        authorization: `Bearer ${get(accessTokens, `${ICML}`)}`,
        ...form.getHeaders(),
      },
      data: form,
    })
      .then(async res => {
        await saveDataLocally(icmlTempPath, 'index.icml', res.data, 'utf-8')
        resolve()
      })
      .catch(err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }

        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          accessTokens[ICML] = undefined
        }

        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}

const pdfHandler = async (zipPath, outputPath, filename) => {
  if (!get(accessTokens, `${PAGEDJS}`)) {
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
        authorization: `Bearer ${get(accessTokens, `${PAGEDJS}`)}`,
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
      .catch(err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }

        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          accessTokens[PAGEDJS] = undefined
        }

        return reject(
          new Error(`Request failed with status ${status} and message: ${msg}`),
        )
      })
  })
}

const xsweetHandler = async filePath => {
  try {
    if (!get(accessTokens, `${XSWEET}`)) {
      // console.log('get the jwt', accessTokens[XSWEET])
      await serviceHandshake(XSWEET)
    }
    const service = get(services, XSWEET)
    const { port, protocol, host } = service
    const serverUrl = `${protocol}://${host}${port ? `:${port}` : ''}`

    const form = new FormData()
    form.append('docx', fs.createReadStream(filePath))

    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: `${serverUrl}/api/docxToHTML`,
        headers: {
          authorization: `Bearer ${get(accessTokens, `${XSWEET}`)}`,
          ...form.getHeaders(),
        },
        data: form,
      })
        .then(async ({ data }) => {
          const { html } = data
          await fs.remove(filePath)
          resolve(html)
        })
        .catch(async err => {
          // console.log('res', res)
          const { response } = err
          if (!response) {
            return reject(new Error(`Request failed with message: ${err.code}`))
          }
          const { status, data } = response
          const { msg } = data
          if (status === 401 && msg === 'expired token') {
            // retry if expiration happened in the meantime
            accessTokens[XSWEET] = undefined
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
  if (!get(accessTokens, `${PAGEDJS}`)) {
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
        authorization: `Bearer ${get(accessTokens, `${PAGEDJS}`)}`,
        ...form.getHeaders(),
      },
      data: form,
    })
      .then(async ({ data }) => {
        await fs.remove(zipPath)
        resolve(data)
      })
      .catch(err => {
        const { response } = err
        if (!response) {
          return reject(new Error(`Request failed with message: ${err.code}`))
        }

        const { status, data } = response
        const { msg } = data
        if (status === 401 && msg === 'expired token') {
          accessTokens[PAGEDJS] = undefined
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
