const archiver = require('archiver')
const path = require('path')
const fs = require('fs-extra')
const map = require('lodash/map')
const crypto = require('crypto')
const { dirContents } = require('./filesystem')

const epubArchiver = async (tempFolder, target) => {
  try {
    await fs.ensureDir(target)
    const epubFiles = await dirContents(tempFolder)
    return new Promise((resolve, reject) => {
      const destination = path.join(
        target,
        `${crypto.randomBytes(32).toString('hex')}.epub`,
      )
      const output = fs.createWriteStream(destination)
      const archive = archiver('zip')

      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on('close', () => {
        resolve(destination)
      })

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', err => {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          // throw error
          throw err
        }
      })

      // good practice to catch this error explicitly
      archive.on('error', err => {
        throw err
      })

      // pipe archive data to the file
      archive.pipe(output)
      archive.append('application/epub+zip', { name: 'mimetype', store: true })

      const appendFile = item => {
        const absoluteFilePath = path.join(tempFolder, item)

        const stream = fs.createReadStream(absoluteFilePath)

        return archive.append(stream, {
          name: item,
        })
      }

      map(epubFiles, file => appendFile(file))
      archive.finalize()
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { epubArchiver }
