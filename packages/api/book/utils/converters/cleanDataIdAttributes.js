const cheerio = require('cheerio')

module.exports = content => {
  const $ = cheerio.load(content)
  $('section *').each((i, elem) => {
    const $elem = $(elem)
    if ($elem.attr('data-id')) {
      $elem.removeAttr('data-id')
    }
  })

  $('ul').each((i, elem) => {
    const $elem = $(elem)
    if ($elem.attr('custom') || $elem.attr('custom', '')) {
      $elem.removeAttr('custom')
    }
  })

  return $.html('body')
}
