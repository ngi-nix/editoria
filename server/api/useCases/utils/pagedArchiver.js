const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const crypto = require('crypto')
const { dirContents } = require('./filesystem')

const pagedArchiver = async (tempFolder, target) => {
  try {
    await fse.ensureDir(target)
    const bookFiles = await dirContents(tempFolder)
    return new Promise((resolve, reject) => {
      const destination = path.join(
        target,
        `${crypto.randomBytes(32).toString('hex')}.zip`,
      )
      const output = fs.createWriteStream(destination)
      const archive = archiver('zip')
      // pipe archive data to the file
      archive.pipe(output)

      bookFiles.forEach(item => {
        const absoluteFilePath = path.join(tempFolder, item)
        archive.append(fs.createReadStream(absoluteFilePath), { name: item })
      })
      archive.finalize()

      output.on('close', () => {
        resolve(destination)
      })
      archive.on('error', err => reject(err))
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { pagedArchiver }
