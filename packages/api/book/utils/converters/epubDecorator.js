const cheerio = require('cheerio')

const editoriaToEPUBPropertiesMapper = {
  front: 'frontmatter',
  back: 'backmatter',
  body: 'bodymatter',
  chapter: 'chapter',
  part: 'part',
  toc: 'toc',
  introduction: 'introduction',
  preface: 'preface',
  appendix: 'appendix',
  endnotes: 'endnotes',
}
const editoriaExtra = {
  halftitle: 'halftitlepage',
  titlepage: 'titlepage',
}

module.exports = (
  bookComponent,
  bookTitle,
  stylesheet,
  hasEndnotes,
  endNotesComponentId,
) => {
  const { content, componentType, division } = bookComponent
  const $ = cheerio.load(content)

  $('html').attr({
    xmlns: 'http://www.w3.org/1999/xhtml',
    'xmlns:epub': 'http://www.idpf.org/2007/ops',
    'xml:lang': 'en',
    lang: 'en',
  })
  $('<link/>')
    .attr('href', `../Styles/${stylesheet.originalFilename}`)
    .attr('type', 'text/css')
    .attr('rel', 'stylesheet')
    .appendTo('head')
  $('<title/>')
    .text(bookTitle)
    .prependTo('head')
  $('body').attr({
    'xml:lang': 'en',
    'epub:type': editoriaToEPUBPropertiesMapper[division],
    lang: 'en',
  })
  $('nav').attr({
    'epub:type': editoriaToEPUBPropertiesMapper[componentType],
    role: `doc-${editoriaToEPUBPropertiesMapper[componentType]}`,
  })
  if (componentType !== 'toc') {
    if (editoriaToEPUBPropertiesMapper[componentType]) {
      $('section').attr({
        'epub:type': editoriaToEPUBPropertiesMapper[componentType],
        role: `doc-${editoriaToEPUBPropertiesMapper[componentType]}`,
      })
    }
    if (editoriaExtra[componentType]) {
      $('section').attr({
        'epub:type': editoriaToEPUBPropertiesMapper[componentType],
      })
    }
  }

  $('.note-callout').each((i, elem) => {
    const $elem = $(elem)
    $elem.attr('epub:type', 'noteref')
    if (hasEndnotes) {
      const link = $elem.attr('href')

      $elem.attr('href', `comp-number-${endNotesComponentId}.xhtml${link}`)
    }
  })

  $('.footnote').each((i, elem) => {
    const $elem = $(elem)
    $elem.attr('epub:type', 'footnote')
  })
  $('.footnotes').each((i, elem) => {
    const $elem = $(elem)
    $elem.attr('epub:type', 'endnote')
  })

  $('.running-left').each((i, elem) => {
    const $elem = $(elem)
    $elem.remove()
  })
  $('.running-right').each((i, elem) => {
    const $elem = $(elem)
    $elem.remove()
  })

  if (componentType === 'toc') {
    $('li > a').each((i, elem) => {
      const $elem = $(elem)
      const link = $elem.attr('href')
      const clearedLink = link.substr(1)
      $elem.attr('href', `../Text/${clearedLink}.xhtml`)
    })
  }

  return $.html()
}
