const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const get = require('lodash/get')
const crypto = require('crypto')
const mime = require('mime-types')
const url = require('url')
const map = require('lodash/map')

const { writeFile } = require('./filesystem')

const { generatePagedjsContainer } = require('./htmlGenerators')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const icmlPreparation = async book => {
  try {
    const images = []
    const hash = crypto.randomBytes(32).toString('hex')
    const tempDir = `${process.cwd()}/${uploadsDir}/temp`
    const tempDestination = path.join(tempDir, `${hash}`)
    await fs.ensureDir(tempDestination)

    book.divisions.forEach((division, divisionId) => {
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { content, id } = bookComponent
        const $ = cheerio.load(content)

        $('img[src]').each((index, node) => {
          const $node = $(node)
          const constructedId = `image-${id}-${index}`

          const uri = $node.attr('src').replace(/^\//, '') // ensure no leading slash
          const source = url.resolve(`${process.cwd()}/`, uri)
          const extension = path.extname(uri)
          const basename = path.basename(uri)
          const filename = path.basename(uri, extension)
          const mimetype = mime.lookup(uri)
          const target = `${tempDestination}/${basename}`

          images.push({
            id: constructedId,
            source,
            target,
            mimetype,
            basename,
            filename,
            extension,
          })

          $node.attr('src', `./${basename}`)
        })
        $('figure').each((index, node) => {
          const $node = $(node)
          const srcExists = $node.attr('src')
          if (srcExists) {
            $node.removeAttr('src')
          }
        })
        bookComponent.content = $.html('body')
      })
    })

    await Promise.all(
      map(images, async image => {
        const { source, target } = image
        return fs.copy(source, target)
      }),
    )
    const output = cheerio.load(generatePagedjsContainer(book.title))
    book.divisions.forEach((division, divisionId) => {
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { content } = bookComponent
        output('body').append(content)
      })
    })

    await writeFile(`${tempDestination}/index.html`, output.html())
    // return pagedDestination
    return { path: tempDestination, hash }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { icmlPreparation }
