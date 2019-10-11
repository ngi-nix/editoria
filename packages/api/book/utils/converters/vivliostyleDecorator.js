const cheerio = require('cheerio')

module.exports = (bookComponent, bookTitle) => {
  const { title, content } = bookComponent
  console.log('content', content)
  const $ = cheerio.load(content)
  $('<div/>')
    .attr('class', 'dup')
    .html(title)
    .prependTo($('section'))

  $('<div/>')
    .attr('class', 'booktitle')
    .html(bookTitle)
    .prependTo($('section'))

  $('<div>&#xA0;</div>')
    .attr('class', 'folio')
    .prependTo($('section'))

  $('<p/>')
    .attr('class', 'ch-start')
    .html('beginning')
    .prependTo($('section'))


  return $.html('body')
}
