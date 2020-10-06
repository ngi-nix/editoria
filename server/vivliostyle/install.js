const request = require('request')
const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')
const execP = Promise.promisify(require('child_process').exec)
const extract = require('extract-zip')

const vivliostyleVersion = '/vivliostyle-js-2017.6'
const vivliostyleZip = path.join(__dirname, '/vivliostyle.zip')
const vivliostylePath = path.join(__dirname, '/vivliostyle-viewer')
const viliostyleHost = 'https://vivliostyle.github.io/vivliostyle.js'
const downloadLink = `${viliostyleHost}/downloads/${vivliostyleVersion}.zip`

if (!fs.existsSync(vivliostylePath)) {
  if (!fs.existsSync(vivliostyleZip)) {
    request(downloadLink)
      .pipe(fs.createWriteStream(path.join(__dirname, '/vivliostyle.zip')))
      .on('finish', async () => {
        extract(vivliostyleZip, { dir: __dirname }, async err => {
          if (err) {
            console.error(err)
            return
          }
          try {
            await execP(
              `mv ${path.join(
                __dirname,
                `/${vivliostyleVersion}`,
              )} ${vivliostylePath}`,
            )
            await execP(`rm ${vivliostyleZip}`)
          } catch (error) {
            console.error(error)
          }
        })
      })
  } else {
    extract(vivliostyleZip, { dir: __dirname }, async err => {
      if (err) {
        console.error(err)
        return
      }
      try {
        await execP(
          `mv ${path.join(
            __dirname,
            `/${vivliostyleVersion}`,
          )} ${vivliostylePath}`,
        )
        await execP(`rm ${vivliostyleZip}`)
      } catch (error) {
        console.error(error)
      }
    })
  }
}
