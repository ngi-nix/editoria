const cheerio = require('cheerio')

module.exports = (bookComponent, bookTitle) => {
  const { title, content } = bookComponent
  const $ = cheerio.load(content)
  $('<div/>')
    .attr('class', 'dup')
    .html(title)
    .prependTo($('section'))

  $('<div/>')
    .attr('class', 'booktitle')
    .html(bookTitle)
    .appendTo($('section'))

  $('<div>&nbsp;</div>')
    .attr('class', 'folio')
    .appendTo($('section'))

  $('<p/>')
    .attr('class', 'ch-start')
    .html('beginning')
    .appendTo($('section'))


  return $.html('body')
}
