const fs = require('fs')
const config = require('config')
const forEach = require('lodash/forEach')

const { accessKeyId, secretAccessKey, bucket, region } = config.get('aws')

const AWS = require('aws-sdk')

// Initializing S3 Interface
const s3 = new AWS.S3({
  accessKeyId,
  signatureVersion: 'v4',
  region,
  secretAccessKey,
})

const healthCheck = async () =>
  new Promise((resolve, reject) => {
    s3.getBucketLogging({ Bucket: bucket }, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })

const signS3 = async (filename, fileType) => {
  const s3Params = {
    Bucket: bucket,
    Key: filename,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read',
  }

  const signedRequest = await s3.getSignedUrl('putObject', s3Params)
  const url = `https://${bucket}.s3.amazonaws.com/${filename}`

  return {
    signedRequest,
    url,
  }
}
// Returns an event source for making use of the progress of upload
const uploadFile = (fileStream, location, filename, mimeType, metadataTag) => {
  // setting up s3 upload parameters
  const params = {
    Bucket: bucket,
    Key: `${location}/${filename}`, // file name you want to save as
    Body: fileStream,
    ContentType: mimeType,
    ACL: 'public-read',
  }
  return s3.upload(params)
}

const getFileInfo = async uri => {
  const params = {
    Bucket: bucket,
    Key: uri,
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

const listFiles = async () => {
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

// Accepts an array of uris
const deleteFiles = async uris => {
  const params = {
    Bucket: bucket,
    Delete: {
      Objects: [],
      Quiet: false,
    },
  }

  forEach(uris, uri => {
    params.Delete.Objects.push({ Key: uri })
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

const locallyDownloadFile = async (uri, where) => {
  const fileStream = fs.createWriteStream(where)
  const s3Stream = s3.getObject({ Bucket: bucket, Key: uri }).createReadStream()

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
  signS3,
  uploadFile,
  deleteFiles,
  getFileInfo,
  listFiles,
  locallyDownloadFile,
}
