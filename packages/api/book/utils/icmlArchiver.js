const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const config = require('config')
const get = require('lodash/get')
const map = require('lodash/map')
const crypto = require('crypto')
const { dirContents } = require('./filesystem')

const icmlArchiver = async (tempFolder, target) => {
  try {
    // const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')
    // const epubDir = `${process.cwd()}/${uploadsDir}/epubs`
    await fse.ensureDir(target)
    const icmlFiles = await dirContents(tempFolder)
    return new Promise((resolve, reject) => {
      const destination = path.join(
        target,
        `${crypto.randomBytes(32).toString('hex')}.zip`,
      )
      const output = fs.createWriteStream(destination)
      const archive = archiver('zip')
      const appendFile = item =>
        new Promise((resolve, reject) => {
          const absoluteFilePath = path.join(tempFolder, item)
          // const fileContent = await readFile(absoluteFilePath)

          const stream = fs.createReadStream(absoluteFilePath)
          stream.on('error', onError)
          stream.on('readable', onReadable)

          function onError(err) {
            reject(err)
          }

          function onReadable() {
            stream.removeListener('readable', onReadable)
            stream.removeListener('error', onError)

            archive.append(stream, {
              name: item,
            })

            resolve()
          }
        })

      // pipe archive data to the file
      archive.pipe(output)
      Promise.all(map(icmlFiles, file => appendFile(file)))
        .then(() => {
          archive.finalize()
          resolve(destination)
        })
        .catch(reject)

      archive.on('error', err => reject(err))
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { icmlArchiver }
