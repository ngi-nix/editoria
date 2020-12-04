const fs = require('fs-extra')
const config = require('config')
const forEach = require('lodash/forEach')
const sharp = require('sharp')
const crypto = require('crypto')
const path = require('path')

const { accessKeyId, secretAccessKey, bucket, endpoint, port } = config.get(
  'file-server',
)

const AWS = require('aws-sdk')

const url = port ? `${endpoint}:${port}` : `${endpoint}`
// Initializing Storage Interface
const s3 = new AWS.S3({
  accessKeyId,
  signatureVersion: 'v4',
  secretAccessKey,
  s3ForcePathStyle: true,
  endpoint: url,
})
const createImageVersions = async (buffer, tempRoot, fileNameHashed) => {
  try {
    const originalImage = sharp(buffer)
    const originalFileMeta = await originalImage.metadata()
    const { width, height, space, density, size } = originalFileMeta
    const smallPath = path.join(tempRoot, `${fileNameHashed}_small.png`)
    const mediumPath = path.join(tempRoot, `${fileNameHashed}_medium.png`)

    await sharp(buffer)
      .resize(180, 240, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0.0 },
      })
      .toFile(smallPath)

    if (width < 640) {
      await sharp(buffer).toFile(mediumPath)
    } else {
      await sharp(buffer)
        .resize({ width: 640 })
        .toFile(mediumPath)
    }

    return {
      localSmall: smallPath,
      localMedium: mediumPath,
      size,
      metadata: {
        width,
        height,
        space,
        density,
      },
    }
  } catch (e) {
    throw new Error(e)
  }
}

const getFileExtension = filename => {
  const array = filename.split('.')
  return array[array.length - 1]
}

const healthCheck = () =>
  new Promise((resolve, reject) => {
    s3.getBucketLogging({ Bucket: bucket }, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
// getObject, putObject
const signURL = async (operation, key) => {
  const s3Params = {
    Bucket: bucket,
    Key: key,
    Expires: 86400, // 1 day lease
  }

  return s3.getSignedUrl(operation, s3Params)
}

const uploadFileHandler = (fileStream, filename, mimeType) => {
  const params = {
    Bucket: bucket,
    Key: filename, // file name you want to save as
    Body: fileStream,
    ContentType: mimeType,
  }

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err)
      }
      const { Key, Bucket, ETag, Location } = data
      resolve({ key: Key, bucket: Bucket, eTag: ETag, location: Location })
    })
  })
}

const handleImageUpload = async (fileStream, filename, mimeType, encoding) => {
  try {
    const randomHash = crypto.randomBytes(6).toString('hex')
    const outPathRoot = path.join(process.cwd(), 'uploads', 'temp', randomHash)

    await fs.ensureDir(outPathRoot)

    const out = path.join(outPathRoot, filename)
    const outStream = fs.createWriteStream(out)

    fileStream.pipe(outStream, { encoding })

    outStream.on('error', () => {
      throw new Error('Unable to write file')
    })

    const tempBuffs = []
    let buffer

    await new Promise((resolve, reject) => {
      fileStream.on('end', () => {
        buffer = Buffer.concat(tempBuffs)
        resolve()
      })
      fileStream.on('data', chunk => {
        tempBuffs.push(chunk)
      })
      fileStream.on('error', reject)
    })

    const localImageVersionPaths = await createImageVersions(
      buffer,
      outPathRoot,
      filename.split('.')[0], // strip the extension of the file
    )

    const { localSmall, localMedium, metadata, size } = localImageVersionPaths

    const originalImageStream = fs.createReadStream(out)
    const mediumImageStream = fs.createReadStream(localMedium)
    const smallImageStream = fs.createReadStream(localSmall)

    const original = await uploadFileHandler(
      originalImageStream,
      filename,
      mimeType,
    )

    original.metadata = metadata
    original.size = size
    original.extension = `${getFileExtension(filename)}`

    const medium = await uploadFileHandler(
      mediumImageStream,
      path.basename(localMedium),
      'image/png',
    )

    const small = await uploadFileHandler(
      smallImageStream,
      path.basename(localSmall),
      'image/png',
    )

    await fs.remove(outPathRoot)

    return { original, medium, small }
  } catch (e) {
    throw new Error(e)
  }
}

// The return of this function is an array of storage objects
// {
//  original: {location:String, key:String, bucket:String}, // will always have value
//  medium: {location:String, key:String, bucket:String}, //if applicable or undefined
//  small: {location:String, key:String, bucket:String}, //if applicable or undefined
// }
const uploadFile = async (
  fileStream,
  filename,
  mimeType,
  encoding = undefined,
  forceObjectKey = undefined,
) => {
  try {
    let hashedFilename
    if (forceObjectKey) {
      hashedFilename = forceObjectKey
    } else {
      hashedFilename = `${crypto
        .randomBytes(6)
        .toString('hex')}.${getFileExtension(filename)}`
    }

    if (mimeType.match(/^image\//) && encoding) {
      return handleImageUpload(fileStream, hashedFilename, mimeType, encoding)
    }

    const res = await uploadFileHandler(fileStream, hashedFilename, mimeType)
    const { ContentLength } = await getFileInfo(res.key)
    res.size = ContentLength
    res.extension = `${getFileExtension(filename)}`

    return {
      original: res,
      medium: undefined,
      small: undefined,
    }
  } catch (e) {
    throw new Error(e)
  }
}

const getFileInfo = key => {
  const params = {
    Bucket: bucket,
    Key: key,
  }
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const listFiles = () => {
  const params = {
    Bucket: bucket,
  }
  return new Promise((resolve, reject) => {
    s3.listObjects(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

// Accepts an array of file keys
const deleteFiles = keys => {
  const params = {
    Bucket: bucket,
    Delete: {
      Objects: [],
      Quiet: false,
    },
  }

  forEach(keys, key => {
    params.Delete.Objects.push({ Key: key })
  })

  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

const locallyDownloadFile = (key, where) => {
  const fileStream = fs.createWriteStream(where)
  const s3Stream = s3.getObject({ Bucket: bucket, Key: key }).createReadStream()

  return new Promise((resolve, reject) => {
    // Listen for errors returned by the service
    s3Stream.on('error', err => {
      // NoSuchKey: The specified key does not exist
      reject(err)
    })

    s3Stream
      .pipe(fileStream)
      .on('error', err => {
        // capture any errors that occur when writing data to the file
        reject(err)
        console.error('File Stream:', err)
      })
      .on('close', () => {
        resolve()
      })
  })
}

module.exports = {
  healthCheck,
  signURL,
  uploadFile,
  deleteFiles,
  getFileInfo,
  listFiles,
  locallyDownloadFile,
}
