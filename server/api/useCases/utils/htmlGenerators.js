const cheerio = require('cheerio')

const paginationExtractor = pagination => {
  const both = pagination.left && pagination.right

  if (both) {
    return 'start-left start-right'
  } else if (pagination.left) {
    return 'start-left'
  }
  return 'start-right'
}

const generateContainer = (bookComponent, firstInBody = false) => {
  const {
    id,
    title,
    componentType,
    runningHeadersLeft,
    runningHeadersRight,
    pagination,
    division,
    number,
  } = bookComponent
  let output
  if (componentType === 'toc') {
    output = cheerio.load(
      `<section id="comp-number-${id}"  class="component-${division} ${componentType} ${paginationExtractor(
        pagination,
      )}"><div class="running-left">${runningHeadersLeft || '&#xA0;'}</div>
      <div class="running-right">${runningHeadersRight ||
        '&#xA0;'}</div><header><h1 class="ct">${title}</h1></header><nav>
      <ol></ol></nav></section>`,
    )
  } else if (componentType === 'endnotes') {
    output = cheerio.load(
      `<section id="comp-number-${id}"  class="component-${division} ${componentType} ${paginationExtractor(
        pagination,
      )}"><div class="running-left">${runningHeadersLeft || '&#xA0;'}</div>
      <div class="running-right">${runningHeadersRight || '&#xA0;'}</div>
      <header><h1 class="ct">${title}</h1></header></section>`,
    )
  } else {
    let componentNumber
    if (componentType === 'chapter' || componentType === 'part') {
      componentNumber = `<span class="${componentType}-number">${number}</span>`
    }
    output = cheerio.load(
      `<section id="comp-number-${id}"  class="component-${division} ${componentType} ${paginationExtractor(
        pagination,
      )}">${
        firstInBody ? '<span class="restart-numbering"></span>' : ''
      }<div class="running-left">${runningHeadersLeft || '&#xA0;'}</div>
      <div class="running-right">${runningHeadersRight ||
        '&#xA0;'}</div><header>${componentNumber || ''}</header></section>`,
    )
  }
  return output('body').html()
}

const generatePagedjsContainer = bookTitle => {
  const output = cheerio.load(
    `<!DOCTYPE html><html><head><title>${bookTitle}</title>
    <meta charset="UTF-8"></head><body class="hyphenate" lang="en-us"></body></html>`,
  )
  return output.html()
}

module.exports = {
  generatePagedjsContainer,
  generateContainer,
}
