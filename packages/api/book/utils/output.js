// const logger = require('@pubsweet/logger')
// const fs = require('fs')
// const crypto = require('crypto')
// const mkdirp = require('mkdirp')
// const unzipper = require('unzipper')

// const attachment = async (epub, id) => {
//   const path = `${process.cwd()}/uploads/collection-${id}.epub`
//   const wstream = fs.createWriteStream(path)

//   try {
//     const archive = await epub.stream(wstream)
//     return new Promise((resolve, reject) => {
//       archive.on('error', err => {
//         throw new Error(err)
//       })

//       archive.on('end', () => {
//         logger.info('Wrote %d bytes', archive.pointer())
//         resolve(`/uploads/collection-${id}.epub`)
//       })
//     })
//   } catch (error) {
//     throw new Error(error)
//   }
// }

// const writeFile = (location, content) =>
//   new Promise((resolve, reject) => {
//     fs.writeFile(location, content, 'utf8', err => {
//       if (err) return reject(err)
//       return resolve()
//     })
//   })
// const readFile = location =>
//   new Promise((resolve, reject) => {
//     fs.readFile(location, 'utf8', (err, data) => {
//       if (err) return reject(err)
//       return resolve(data)
//     })
//   })

// const folder = async (outcome, stylesRoot = undefined, previewer) => {
//   // TODO: read the path to the uploads folder from config
//   const folder = `${previewer}/${crypto.randomBytes(32).toString('hex')}`
//   const path = `${process.cwd()}/uploads/${folder}`

//   if (fs.existsSync(path)) {
//     throw new Error('Output path already exists')
//   }

//   mkdirp.sync(path)

//   if (previewer === 'vivliostyle') {
//     try {
//       const archive = await outcome.stream(unzipper.Extract({ path }))
//       return new Promise((resolve, reject) => {
//         archive.on('error', err => {
//           throw new Error(err)
//         })

//         archive.on('end', () => {
//           logger.info('Wrote %d bytes', archive.pointer())
//           resolve(folder)
//         })
//       })
//     } catch (error) {
//       throw new Error(error)
//     }
//   } else {
//     try {
//       const where = `${path}/index.html`
//       const styles = `${path}/default.css`
//       const content = outcome.html()
//       const stylesContent = await readFile(`${stylesRoot}/paged_default.css`)

//       await writeFile(where, content)
//       await writeFile(styles, stylesContent)
//       return folder
//     } catch (error) {
//       return 'error'
//     }
//   }
// }

// module.exports = {
//   attachment,
//   folder,
// }
