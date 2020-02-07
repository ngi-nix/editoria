const config = require('config')
const logger = require('@pubsweet/logger')

const { accessKeyId, secretAccessKey, bucket } = config.get(
  'pubsweet-server',
).aws
const AWS = require('aws-sdk')

// Initializing S3 Interface
const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
})

// Returns a an event source for making use of the progress of upload
const uploadFile = (fileStream, location, filename, mimeType, metadataTag) => {
  // setting up s3 upload parameters
  const params = {
    Bucket: bucket,
    Key: `${location}/${filename}`, // file name you want to save as
    Body: fileStream,
    ContentType: mimeType,
    Metadata: {
      'x-amz-meta-type': metadataTag,
    },
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
// TODO:
//deleteFile,
//updateFile,
//locallyDownloadFile

module.exports = {
  uploadFile,
  // deleteFile,
  getFileInfo,
  listFiles,
  // updateFile,
  // locallyDownloadFile,
}
