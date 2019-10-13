const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const get = require('lodash/get')
const crypto = require('crypto')
const mime = require('mime-types')
const url = require('url')
const map = require('lodash/map')

const { readFile, writeFile } = require('./filesystem')

const { fixFontFaceUrls } = require('./converters')

const { generatePagedjsContainer } = require('./htmlGenerators')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const pagednation = async (book, template, pdf = false) => {
  try {
    const templateFiles = await template.getFiles()
    const fonts = []
    const stylesheets = []
    const images = []
    const pagedDir = `${process.cwd()}/${uploadsDir}/paged`
    const pagedDestination = path.join(
      pagedDir,
      `${crypto.randomBytes(32).toString('hex')}`,
    )
    await fs.ensureDir(pagedDestination)

    for (let i = 0; i < templateFiles.length; i += 1) {
      const { id: dbId, source: uri } = templateFiles[i]
      const source = url.resolve(`${process.cwd()}/`, uri)
      const extension = path.extname(uri)
      const basename = path.basename(uri)
      const filename = path.basename(uri, extension)
      const mimetype = mime.lookup(uri)
      if (templateFiles[i].mimetype === 'text/css') {
        const target = `${pagedDestination}/default.css`
        const id = `stylesheet-${dbId}-${i}`
        stylesheets.push({
          id,
          source,
          target,
          mimetype,
          basename,
          filename,
          extension,
        })
      } else {
        const target = `${pagedDestination}/${basename}`
        const id = `font-${dbId}-${i}`
        fonts.push({
          id,
          source,
          target,
          mimetype,
          basename,
          filename,
          extension,
        })
      }
    }
    stylesheets[0].content = await readFile(stylesheets[0].source)

    if (stylesheets.length === 0) {
      throw new Error(
        'No stylesheet file exist in the template, export aborted',
      )
    }

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
          const target = `${pagedDestination}/${basename}`

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

    fixFontFaceUrls(stylesheets[0], fonts, '.')
    await Promise.all(
      map(images, async image => {
        const { source, target } = image
        return fs.copy(source, target)
      }),
    )
    await Promise.all(
      map(stylesheets, async stylesheet => {
        const { content, target } = stylesheet
        return writeFile(target, content)
      }),
    )
    await Promise.all(
      map(fonts, async font => {
        const { source, target } = font
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
    if (pdf) {
      output('<link/>')
        .attr('href', './default.css')
        .attr('type', 'text/css')
        .attr('rel', 'stylesheet')
        .appendTo('head')
    }
    await writeFile(`${pagedDestination}/index.html`, output.html())
    return pagedDestination
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { pagednation }
