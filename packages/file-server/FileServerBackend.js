const fs = require('fs')
const fse = require('fs-extra')
const config = require('config')
const mime = require('mime-types')
const get = require('lodash/get')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const readFile = location =>
  new Promise((resolve, reject) => {
    fs.readFile(location, 'binary', (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })

const FileServerBackend = app => {
  app.use('/api/fileserver/cleanup/:scope/:hash', async (req, res, next) => {
    const { scope, hash } = req.params
    const path = `${process.cwd()}/${uploadsDir}/${scope}/${hash}`
    try {
      await fse.remove(path)
      res.end()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
  app.use('/api/fileserver/:scope/:location/:file', async (req, res, next) => {
    const { location, file, scope } = req.params
    const path = `${process.cwd()}/${uploadsDir}/${scope}/${location}/${file}`
    const mimetype = mime.lookup(path)

    try {
      const fileContent = await readFile(path)
      res.setHeader('Content-Type', `${mimetype}`)
      res.setHeader('Content-Disposition', `attachment; filename=${file}`)
      res.write(fileContent, 'binary')
      res.end()
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })
}

module.exports = FileServerBackend
