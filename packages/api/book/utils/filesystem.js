const fs = require('fs')

const writeFile = (location, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(location, content, 'utf8', err => {
      if (err) return reject(err)
      return resolve()
    })
  })
const readFile = location =>
  new Promise((resolve, reject) => {
    fs.readFile(location, 'utf8', (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })

module.exports = {
  writeFile,
  readFile,
}
