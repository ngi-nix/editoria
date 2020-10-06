const cheerio = require('cheerio')
const fs = require('fs-extra')
const path = require('path')
const config = require('config')
const get = require('lodash/get')
const crypto = require('crypto')
const mime = require('mime-types')
const {
  useCaseFetchRemoteFileLocally,
  useCaseSignURL,
} = require('../../useCases')
const { imageGatherer } = require('./gatherImages')
const map = require('lodash/map')

const { readFile, writeFile } = require('./filesystem')

const { fixFontFaceUrls } = require('./converters')

const { generatePagedjsContainer } = require('./htmlGenerators')

const { objectKeyExtractor } = require('../../../../app/components/common')

const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

const pagednation = async (book, template, pdf = false) => {
  try {
    const templateFiles = await template.getFiles()
    const fonts = []
    const stylesheets = []
    const images = []
    const hash = crypto.randomBytes(32).toString('hex')
    const pagedDir = `${process.cwd()}/${uploadsDir}/paged`
    const pagedDestination = path.join(pagedDir, `${hash}`)
    await fs.ensureDir(pagedDestination)

    for (let i = 0; i < templateFiles.length; i += 1) {
      const { id: dbId, objectKey, mimetype, extension, name } = templateFiles[
        i
      ]
      const originalFilename = `${name}.${extension}`

      if (templateFiles[i].mimetype === 'text/css') {
        const target = `${pagedDestination}/${originalFilename}`
        const id = `stylesheet-${dbId}-${i}`
        stylesheets.push({
          id,
          objectKey,
          target,
          mimetype,
          originalFilename,
          extension,
        })
      } else {
        const target = `${pagedDestination}/${originalFilename}`
        const id = `font-${dbId}-${i}`
        fonts.push({
          id,
          objectKey,
          target,
          mimetype,
          originalFilename,
          extension,
        })
      }
    }
    if (stylesheets.length === 0) {
      throw new Error(
        'No stylesheet file exists in the selected template, export aborted',
      )
    }
    const gatheredImages = imageGatherer(book)
    const freshImageLinkMapper = {}

    await Promise.all(
      map(gatheredImages, async image => {
        const { currentObjectKey } = image
        freshImageLinkMapper[currentObjectKey] = await useCaseSignURL(
          'getObject',
          currentObjectKey,
        )
        return true
      }),
    )
    book.divisions.forEach((division, divisionId) => {
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { content, id } = bookComponent
        const $ = cheerio.load(content)

        $('img[src]').each((index, node) => {
          const $node = $(node)
          const constructedId = `image-${id}-${index}`
          const url = $node.attr('src')
          const objectKey = objectKeyExtractor(url)
          const extension = path.extname(objectKey)
          const mimetype = mime.lookup(objectKey)
          const target = `${pagedDestination}/${objectKey}`

          images.push({
            id: constructedId,
            objectKey,
            target,
            mimetype,
            extension,
          })

          if (pdf) {
            $node.attr('src', `./${objectKey}`)
          } else {
            $node.attr('src', freshImageLinkMapper[objectKey])
          }
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
        const { objectKey, target } = image
        return useCaseFetchRemoteFileLocally(objectKey, target)
      }),
    )
    await Promise.all(
      map(stylesheets, async stylesheet => {
        const { objectKey, target } = stylesheet
        return useCaseFetchRemoteFileLocally(objectKey, target)
      }),
    )
    await Promise.all(
      map(fonts, async font => {
        const { objectKey, target } = font
        return useCaseFetchRemoteFileLocally(objectKey, target)
      }),
    )

    const stylesheetContent = await readFile(stylesheets[0].target)
    const fixedCSS = fixFontFaceUrls(stylesheetContent, fonts, '.')
    await writeFile(`${stylesheets[0].target}`, fixedCSS)
    const output = cheerio.load(generatePagedjsContainer(book.title))

    book.divisions.forEach((division, divisionId) => {
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { content } = bookComponent
        output('body').append(content)
      })
    })
    if (pdf) {
      output('<link/>')
        .attr('href', `./${stylesheets[0].originalFilename}`)
        .attr('type', 'text/css')
        .attr('rel', 'stylesheet')
        .appendTo('head')
    }
    await writeFile(`${pagedDestination}/index.html`, output.html())
    return { clientPath: `${hash}/template/${template.id}`, hash }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = { pagednation }
