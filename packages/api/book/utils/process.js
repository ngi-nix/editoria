const cheerio = require('cheerio')

module.exports = ({
  styles,
  activeConverters,
  book,
  notesPart,
  previewer,
}) => bookComponent => {
  let content
  const $ = cheerio.load(bookComponent.content)
  const fragmentTitle = bookComponent.title || 'Untitled'
  const fragmentId = bookComponent.id
  const bookTitle = book.title
  const fragmentDivision = bookComponent.division
  const fragmentSubcategory = bookComponent.componentType
  const fragmentNumber = Object.prototype.hasOwnProperty.call(
    bookComponent,
    'number',
  )
    ? bookComponent.number
    : -1

  if (notesPart === undefined) {
    activeConverters.forEach(converter =>
      converter(
        $,
        fragmentId,
        fragmentTitle,
        bookTitle,
        fragmentDivision,
        fragmentSubcategory,
        fragmentNumber,
      ),
    )
  } else {
    activeConverters.forEach(converter =>
      converter(
        $,
        fragmentId,
        fragmentTitle,
        bookTitle,
        fragmentDivision,
        fragmentSubcategory,
        fragmentNumber,
        notesPart,
      ),
    )
  }

  if (previewer === 'vivliostyle') {
    styles.forEach(uri => {
      $('<link rel="stylesheet"/>')
        .attr('href', uri)
        .appendTo('head')
    })
    content = $.html()
  } else {
    content = $('body').html()
  }

  return {
    title: fragmentTitle,
    id: fragmentId,
    content,
    division: fragmentDivision,
    type: fragmentSubcategory,
  }
}
