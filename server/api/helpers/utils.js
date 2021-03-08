const cheerio = require('cheerio')
const fs = require('fs-extra')
const archiver = require('archiver')
const path = require('path')
const crypto = require('crypto')
const list = require('list-contents')

const utils = {}

const dirContents = async path =>
  new Promise((resolve, reject) => {
    list(path, o => {
      if (o.error) reject(o.error)
      resolve(o.files)
    })
  })

const writeLocallyFromReadStream = async (
  path,
  filename,
  readerStream,
  encoding,
) =>
  new Promise(async (resolve, reject) => {
    await fs.ensureDir(path)
    const writerStream = fs.createWriteStream(`${path}/${filename}`, encoding)

    writerStream.on('close', () => {
      resolve()
    })
    writerStream.on('error', err => {
      reject(err)
    })
    readerStream.pipe(writerStream)
  })

const saveDataLocally = async (path, filename, data, encoding) =>
  new Promise(async (resolve, reject) => {
    await fs.ensureDir(path)
    const writeStream = fs.createWriteStream(`${path}/${filename}`, {
      encoding,
    })

    // write some data with a base64 encoding
    writeStream.write(data)

    // the finish event is emitted when all data has been flushed from the stream
    writeStream.on('finish', () => {
      resolve()
    })

    // close the stream
    writeStream.end()
  })

const zipper = async dirPath => {
  try {
    const tempPath = path.join(
      `${process.cwd()}`,
      'tmp',
      `${crypto.randomBytes(32).toString('hex')}`,
    )
    await fs.ensureDir(tempPath)
    const contents = await dirContents(dirPath)
    return new Promise((resolve, reject) => {
      const destination = path.join(
        tempPath,
        `${crypto.randomBytes(32).toString('hex')}.zip`,
      )
      const output = fs.createWriteStream(destination)
      const archive = archiver('zip')
      // pipe archive data to the file
      archive.pipe(output)

      contents.forEach(item => {
        const absoluteFilePath = path.join(dirPath, item)
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

const imageFinder = (content, fileId) => {
  let found = false
  if (content && content.length > 0) {
    const $ = cheerio.load(content)

    $('img').each((i, elem) => {
      const $elem = $(elem)
      const _fileId = $elem.attr('data-fileid')
      if (_fileId === fileId) {
        found = true
      }
    })
  }

  return found
}

utils.reorderArray = (array, item, to, from = undefined) => {
  const resArray = []

  for (let i = 0; i < array.length; i += 1) {
    resArray.push(array[i])
  }

  if (from === undefined) {
    resArray.push(item)
    from = from || resArray.length - 1
  }
  const dragged = resArray.splice(from, 1)[0]
  resArray.splice(to, 0, dragged)
  return resArray
}

utils.isEmpty = data => {
  let isEmpty = false
  if (!data) {
    isEmpty = true
  } else {
    isEmpty = data.trim().length === 0
  }

  return isEmpty
}

utils.imageFinder = imageFinder
utils.writeLocallyFromReadStream = writeLocallyFromReadStream
utils.saveDataLocally = saveDataLocally
utils.zipper = zipper
utils.dirContents = dirContents

module.exports = utils
