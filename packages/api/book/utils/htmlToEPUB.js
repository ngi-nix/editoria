const cheerio = require('cheerio')
const crypto = require('crypto')
const path = require('path')
const builder = require('xmlbuilder')
const fs = require('fs-extra')
const tidy = require('libtidy-updated')
const mime = require('mime-types')
const url = require('url')
const config = require('config')
const get = require('lodash/get')
const map = require('lodash/map')
const { writeFile } = require('./filesystem')
const beautify = require('js-beautify').html
const { epubDecorator } = require('./converters')

const images = []
const stylesheets = []
const fonts = []
const xhtmls = []

const createEPUBFolder = async () => {
  try {
    const result = {}
    const uploadsDir = get(config, ['pubsweet-server', 'uploads'], 'uploads')

    const folder = `temp/${crypto.randomBytes(32).toString('hex')}`
    const tempPath = `${process.cwd()}/${uploadsDir}/${folder}`
    await fs.ensureDir(tempPath)
    result.root = tempPath
    const metaPath = path.join(tempPath, 'META-INF')
    await fs.ensureDir(metaPath)
    result.metaInf = metaPath
    const oebpsPath = path.join(tempPath, 'OEBPS')
    await fs.ensureDir(oebpsPath)
    result.oebps = oebpsPath
    const imagesPath = path.join(oebpsPath, 'Images')
    await fs.ensureDir(imagesPath)
    result.images = imagesPath
    const fontsPath = path.join(oebpsPath, 'Fonts')
    await fs.ensureDir(fontsPath)
    result.fonts = fontsPath
    const stylesPath = path.join(oebpsPath, 'Styles')
    await fs.ensureDir(stylesPath)
    result.styles = stylesPath
    const textPath = path.join(oebpsPath, 'Text')
    await fs.ensureDir(textPath)
    result.texts = textPath

    return result
  } catch (e) {
    throw new Error(e)
  }
}

const createMimetype = async rootPath => {
  try {
    return writeFile(`${rootPath}/mimetype`, 'application/epub+zip')
  } catch (e) {
    throw new Error(e)
  }
}

const createContainer = async metaInfPath => {
  try {
    const container = builder
      .create(
        {
          container: {
            '@xmlns': 'urn:oasis:names:tc:opendocument:xmlns:container',
            '@version': '1.0',
            rootfiles: {
              rootfile: {
                '@full-path': 'OEBPS/content.opf',
                '@media-type': 'application/oebps-package+xml',
              },
            },
          },
        },
        { encoding: 'UTF-8' },
      )
      .end({
        pretty: true,
      })
    return writeFile(`${metaInfPath}/container.xml`, container)
  } catch (e) {
    throw new Error(e)
  }
}
const gatherAssets = async (book, templateFiles, epubFolder) => {
  for (let i = 0; i < templateFiles.length; i += 1) {
    const { id: dbId, source: uri } = templateFiles[i]
    const source = url.resolve(`${process.cwd()}/`, uri)
    const extension = path.extname(uri)
    const basename = path.basename(uri)
    const filename = path.basename(uri, extension)
    const mimetype = mime.lookup(uri)
    if (templateFiles[i].mimetype === 'text/css') {
      const target = `${epubFolder.styles}/${basename}`
      const id = `stylesheet-${dbId}-0`
      stylesheets.push({
        id: `stylesheet-${id}-0`,
        source,
        target,
        mimetype,
        basename,
        filename,
        extension,
      })
    } else {
      const target = `${epubFolder.fonts}/${basename}`
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
  if (stylesheets.length === 0) {
    throw new Error('No stylesheet file exist in the template, export aborted')
  }

  book.divisions.forEach((division, divisionId) => {
    division.bookComponents.forEach((bookComponent, bookComponentId) => {
      const { content, id } = bookComponent
      console.log('id', id)
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
        const target = `${epubFolder.images}/${basename}`

        images.push({
          id: constructedId,
          source,
          target,
          mimetype,
          basename,
          filename,
          extension,
        })
        $node.attr('href', `../Images/${basename}`)
      })
      bookComponent.content = $.html('body')
    })
  })
}

const transferAssets = async (images, stylesheets, fonts) => {
  try {
    await Promise.all(
      map(images, async image => {
        const { source, target } = image
        return fs.copy(source, target)
      }),
    )
    await Promise.all(
      map(stylesheets, async stylesheet => {
        const { source, target } = stylesheet
        return fs.copy(source, target)
      }),
    )
    await Promise.all(
      map(fonts, async font => {
        const { source, target } = font
        return fs.copy(source, target)
      }),
    )
  } catch (e) {
    throw new Error(e)
  }
}

const decorateText = async book => {
  book.divisions.forEach((division, divisionId) => {
    division.bookComponents.forEach((bookComponent, bookComponentId) => {
      bookComponent.content = epubDecorator(
        bookComponent,
        book.title,
        stylesheets[0],
      )
      // console.log('content', bookComponent.content)
    })
  })
}

const generateTOCNCX = async (book, epubFolder) => {
  const navPoints = []
  book.divisions.forEach((division, divisionId) => {
    division.bookComponents.forEach((bookComponent, bookComponentId) => {
      const { id, includeInTOC, title, componentType } = bookComponent
      if (true) {
        navPoints.push({
          '@id': id,
          navLabel: {
            text: {
              '#text': title || componentType,
            },
          },
          content: {
            '@src': `Text/comp-number-${id}.xhtml`,
          },
        })
      }
    })
  })
  const toc = {
    ncx: {
      '@xmlns': 'http://www.daisy.org/z3986/2005/ncx/',
      '@version': '2005-1',
      head: {
        meta: [
          {
            '@content': book.id,
            '@name': 'dtb:uid',
          },
          {
            '@content': '1',
            '@name': 'dtb:depth',
          },
          {
            '@content': '0',
            '@name': 'dtb:totalPageCount',
          },
          {
            '@content': '0',
            '@name': 'dtb:maxPageNumber',
          },
        ],
      },
      docTitle: {
        text: {
          '#text': book.title,
        },
      },
      navMap: {
        navPoint: navPoints,
      },
    },
  }
  const output = builder
    .create(toc, { encoding: 'UTF-8', standalone: 'no' })
    .end({
      pretty: true,
    })
  await writeFile(`${epubFolder.oebps}/toc.ncx`, output)
}

const generateContentOPF = async (book, epubFolder) => {
  const { metadata, title, updated } = book
  const {
    isbn,
    issn,
    issnL,
    copyrightStatement,
    copyrightYear,
    copyrightHolder,
    license,
    authors,
    publicationDate,
  } = metadata
  const spineData = []
  const manifestData = []
  const identifier = isbn || issn || issnL
  let identifierTemp
  let publicationDateTemp
  let rights = `${copyrightYear ||''} ${copyrightStatement ||''} ${copyrightHolder ||''}`
  const metaTemp = []
  metaTemp.push({
    '@property': 'dcterms:modified',
    '#text': updated.toISOString().replace(/\.\d+Z$/, 'Z'),
  })
  if (identifier) {
    identifierTemp = {
      'dc:identifier': {
        '@id': 'BookId',
        '#text': `urn:uuid:${identifier}`,
      },
    }
    metaTemp.push({
      '@refines': '#BookId',
      '@property': 'identifier-type',
      '@scheme': 'onix:codelist5',
      '#text': 15,
    })
  }
  if (publicationDate) {
    publicationDateTemp = {
      'dc:date': {
        '#text': publicationDate,
      },
    }
  }

  book.divisions.forEach((division, divisionId) => {
    division.bookComponents.forEach((bookComponent, bookComponentId) => {
      const { id, componentType } = bookComponent
      spineData.push({
        '@idref': `comp-number-${id}`,
      })
      const tempManifestItem = {
        '@href': `Text/comp-number-${id}.xhtml`,
        '@id': `comp-number-${id}`,
        '@media-type': 'application/xhtml+xml',
      }
      if (componentType === 'toc') {
        tempManifestItem['@properties'] = 'nav'
      }
      manifestData.push(tempManifestItem)
    })
  })
  for (let i = 0; i < images.length; i += 1) {
    manifestData.push({
      '@href': `Images/${images[i].basename}`,
      '@id': `${images[i].id}`,
      '@media-type': `${images[i].mimetype}`,
    })
  }
  for (let i = 0; i < fonts.length; i += 1) {
    manifestData.push({
      '@href': `Fonts/${fonts[i].basename}`,
      '@id': `${fonts[i].id}`,
      '@media-type': `${fonts[i].mimetype}`,
    })
  }
  for (let i = 0; i < stylesheets.length; i += 1) {
    manifestData.push({
      '@href': `Styles/${stylesheets[i].basename}`,
      '@id': `${stylesheets[i].id}`,
      '@media-type': `${stylesheets[i].mimetype}`,
    })
  }
  manifestData.push({
    '@href': `toc.ncx`,
    '@id': 'ncx',
    '@media-type': 'application/x-dtbncx+xml',
  })
  const contentOPF = {
    package: {
      '@prefix':
        'rendition: http://www.idpf.org/vocab/rendition/# schema: http://schema.org/ ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/ a11y: http://www.idpf.org/epub/vocab/package/a11y/#',
      '@xmlns': 'http://www.idpf.org/2007/opf',
      '@version': '3.0',
      '@unique-identifier': 'BookId',
      metadata: {
        '@xmlns:opf': 'http://www.idpf.org/2007/opf',
        '@xmlns:dcterms': 'http://purl.org/dc/terms/',
        '@xmlns:dc': 'http://purl.org/dc/elements/1.1/',
        '@xmlns:ibooks': 'http://apple.com/ibooks/html-extensions',
        'dc:title': { '#text': title },
        'dc:language': { '#text': 'en' },
        meta: {
          '@property': 'dcterms:modified',
          '#text': updated.toISOString().replace(/\.\d+Z$/, 'Z'),
        },
      },
      manifest: { item: manifestData },
      spine: {
        itemRef: spineData,
      },
    },
  }
  const output = builder
    .create(contentOPF, { encoding: 'UTF-8', standalone: 'no' })
    .end({
      pretty: true,
    })
  await writeFile(`${epubFolder.oebps}/content.opf`, output)
}

const convertToXML = async content => {
  const options = {
    doctype: 'html5',
    output_xhtml: true,
    force_output: true,
    tidy_mark: false,
    drop_empty_elements: false,
  }

  return new Promise((resolve, reject) => {
    tidy.tidyBuffer(content, options, (err, result) => {
      if (err) {
        reject(err)
      } else if (!result.output) {
        reject(new Error('The document failed to parse'))
      } else {
        console.warn(result.errlog)
        try {
          resolve(result.output.toString())
        } catch (err) {
          console.error(err)
          reject(new Error('There was an error loading the document'))
        }
      }
    })
  })
}

const gatherTexts = async (book, epubFolder) => {
  try {
    book.divisions.forEach((division, divisionId) => {
      division.bookComponents.forEach((bookComponent, bookComponentId) => {
        const { content: dbContent, id, componentType } = bookComponent
        const constructedId = `comp-number-${id}`
        const source = undefined
        const extension = '.xhtml'
        const basename = `${constructedId}.xhtml`
        const filename = `${constructedId}`
        const mimetype = 'application/xhtml+xml'
        const target = `${epubFolder.texts}/${constructedId}.xhtml`
        const tempContent = cheerio.load(dbContent)
        const content = tempContent.xml()

        xhtmls.push({
          id: constructedId,
          source,
          target,
          mimetype,
          basename,
          filename,
          extension,
          componentType,
          content,
        })
      })
    })
  } catch (e) {
    throw new Error(e)
  }
}

const transferTexts = async texts => {
  try {
    await Promise.all(
      map(texts, async text => {
        const { content, target } = text
        const tidyContent = await convertToXML(
          `<?xml version="1.0" encoding="utf-8" standalone="no"?>${content}`,
        )
        return writeFile(target, beautify(tidyContent))
      }),
    )
  } catch (e) {
    throw new Error(e)
  }
}

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

const htmlToEPUB = async (book, template) => {
  try {
    const templateFiles = await template.getFiles()
    const epubFolder = await createEPUBFolder()

    await createMimetype(epubFolder.root)
    await createContainer(epubFolder.metaInf)
    await gatherAssets(book, templateFiles, epubFolder)
    await transferAssets(images, stylesheets, fonts)
    await decorateText(book)
    await gatherTexts(book, epubFolder)
    await transferTexts(xhtmls)
    await generateTOCNCX(book, epubFolder)
    await generateContentOPF(book, epubFolder)
    // console.log('images', images)
    // console.log('fonts', fonts)
    // console.log('stylesheet', stylesheets)

    console.log('folder', epubFolder)
    return epubFolder.root
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  htmlToEPUB,
}
