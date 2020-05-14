const cheerio = require('cheerio')
const find = require('lodash/find')

const replaceImageSrc = (content, files) => {
  const $ = cheerio.load(content)

  $('img').each((i, elem) => {
    const $elem = $(elem)
    const fileId = $elem.attr('data-fileId')

    const correspondingFile = find(files, { id: fileId })
    const { source, alt } = correspondingFile
    elem.attr('src', source)

    if (alt) {
      elem.attr('alt', alt)
    }
  })
  return $.html()
}

export { replaceImageSrc }
