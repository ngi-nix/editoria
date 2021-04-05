const hljs = require('highlight.js')
const cheerio = require('cheerio')
const katex = require('katex')

module.exports = (
  container,
  bookComponent,
  notesType,
  tocComponent,
  endnotesComponent = undefined,
  shouldMathML,
) => {
  const {
    title,
    componentType,
    content,
    includeInTOC,
    division,
    id,
  } = bookComponent
  const toc = cheerio.load(tocComponent.content)
  let hasMath = false

  if (includeInTOC) {
    const li = `<li class="toc-${division} toc-${componentType}"><a href="#comp-number-${id}"><span class="name">${title ||
      componentType}</span></a></li>`

    toc('ol').append(li)
    tocComponent.content = toc('body').html()
  }

  if (!content) return container

  const $ = cheerio.load(bookComponent.content)
  if (componentType === 'endnotes') {
    return $('body').html()
  }
  let chapterEndnotes

  if (notesType === 'chapterEnd') {
    chapterEndnotes = cheerio.load(
      `<aside class="footnotes"><h2 class="notes-title">Notes</h2></aside>`,
    )
  }
  const endnotes = endnotesComponent && cheerio.load(endnotesComponent.content)
  const outerContainer = cheerio.load(container)

  $('pre code').each((i, elem) => {
    const $elem = $(elem)
    const res = hljs.highlightAuto($elem.text())
    const { language, value } = res
    const pre = $(`<pre class="${language}"/>`)
    const code = $('<code/>').append(value)
    pre.append(code)
    $elem.replaceWith(pre)
  })

  $('math-inline').each((i, elem) => {
    const $elem = $(elem)
    const html = katex.renderToString($elem.text(), {
      output: shouldMathML ? 'mathml' : 'html',
    })
    const span = $('<span/>')
      .attr('class', 'math-node')
      .html(html)
    $elem.replaceWith(span)
    hasMath = true
  })

  $('math-display').each((i, elem) => {
    const $elem = $(elem)
    const html = katex.renderToString($elem.text(), {
      output: shouldMathML ? 'mathml' : 'html',
    })
    const div = $('<div/>')
      .attr('class', 'math-node')
      .html(html)
    $elem.replaceWith(div)
    hasMath = true
  })

  // chapter title
  $('h1').each((i, elem) => {
    const $elem = $(elem)
    const h1 = $('<h1/>')
      .attr('class', 'component-title')
      .html($elem.html())

    $elem.replaceWith(h1)

    outerContainer('header').append(h1)
    $elem.remove()
  })
  // subtitle
  $('p').each((i, elem) => {
    const $elem = $(elem)
    const p = $('<p/>')

    if ($elem.attr('class') === 'component-subtitle') {
      p.attr('class', 'cst').html($elem.html())
      outerContainer('header').append(p)
      $elem.remove()
    }
  })

  $('span').each((i, elem) => {
    const $elem = $(elem)
    // trackChange Addition
    if ($elem.attr('class') === 'insertion') {
      $elem.replaceWith($elem.html())
    }
    // trackChange Deletion
    if ($elem.attr('class') === 'deletion') {
      $elem.remove()
    }
    // comment
    if ($elem.attr('class') === 'comment') {
      $elem.replaceWith($elem.html())
    }
  })

  const hasNotesOuter = outerContainer('footnote').length > 0
  const hasNotesInner = $('footnote').length > 0

  // only notes in header tag
  if (hasNotesOuter && !hasNotesInner) {
    if (notesType === 'footnotes') {
      let noteNumberFoot = 0
      if (hasNotesOuter) {
        // if notes exist in header area. this  should be done in a better way
        outerContainer('footnote').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('id')
          noteNumberFoot += 1
          const content = `${$elem.html()}`

          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberFoot}</a><span class="footnote" id="${bookComponent.id}-${id}">${content}</span>`,
          )

          $elem.replaceWith(callout)
        })
      }
    } else if (notesType === 'endnotes') {
      const notesSectionHeader = endnotes('<h2/>')
        .attr('class', 'notes-title')
        .html(title || componentType)
      endnotes('section').append(notesSectionHeader)
      const notesList = endnotes('<ol/>').attr('class', 'end-notes')
      // replace inline notes with endnotes
      let noteNumberEnd = 0
      if (hasNotesOuter) {
        // if notes exist in header area. this should be done in a better way
        outerContainer('footnote').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('id')
          noteNumberEnd += 1
          const content = `${$elem.html()}`
          const li = endnotes('<li/>').html(content)
          li.attr('id', `${bookComponent.id}-${id}`)
          notesList.append(li)
          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberEnd}</a>`,
          )

          $elem.replaceWith(callout)
        })
      }
      endnotes('section').append(notesList)
      endnotesComponent.content = endnotes('body').html()
    } else {
      const notesList = chapterEndnotes('<ol/>').attr(
        'class',
        `${componentType}-notes`,
      )
      let noteNumberChpEnd = 0
      if (hasNotesOuter) {
        outerContainer('footnote').each((i, elem) => {
          const $elem = $(elem)
          const id = $elem.attr('id')
          noteNumberChpEnd += 1
          const content = `${$elem.html()}`

          const li = chapterEndnotes('<li/>').html(content)
          li.attr('id', `${bookComponent.id}-${id}`)
          notesList.append(li)
          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberChpEnd}</a>`,
          )

          $elem.replaceWith(callout)
        })
      }
      chapterEndnotes('aside').append(notesList)
    }
  }

  if (hasNotesInner) {
    if (notesType === 'footnotes') {
      let noteNumberFoot = 0
      if (hasNotesOuter) {
        // if notes exist in header area. this  should be done in a better way
        outerContainer('footnote').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('id')
          noteNumberFoot += 1
          const content = `${$elem.html()}`

          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberFoot}</a><span class="footnote" id="${bookComponent.id}-${id}">${content}</span>`,
          )

          $elem.replaceWith(callout)
        })
      }

      $('footnote').each((i, elem) => {
        const $elem = $(elem)

        const id = $elem.attr('id')
        noteNumberFoot += 1
        const content = `${$elem.html()}`

        const callout = $(
          `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberFoot}</a><span class="footnote" id="${bookComponent.id}-${id}">${content}</span>`,
        )

        $elem.replaceWith(callout)
      })
    } else if (notesType === 'endnotes') {
      const notesSectionHeader = endnotes('<h2/>')
        .attr('class', 'notes-title')
        .html(title || componentType)
      endnotes('section').append(notesSectionHeader)
      const notesList = endnotes('<ol/>').attr('class', 'end-notes')
      // replace inline notes with endnotes
      let noteNumberEnd = 0
      if (hasNotesOuter) {
        // if notes exist in header area. this should be done in a better way
        outerContainer('footnote').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('id')
          noteNumberEnd += 1
          const content = `${$elem.html()}`
          const li = endnotes('<li/>').html(content)
          li.attr('id', `${bookComponent.id}-${id}`)
          notesList.append(li)
          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberEnd}</a>`,
          )

          $elem.replaceWith(callout)
        })
      }

      $('footnote').each((i, elem) => {
        const $elem = $(elem)

        const id = $elem.attr('id')
        noteNumberEnd += 1
        const content = `${$elem.html()}`

        const li = endnotes('<li/>').html(content)
        li.attr('id', `${bookComponent.id}-${id}`)
        notesList.append(li)
        const callout = $(
          `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberEnd}</a>`,
        )

        $elem.replaceWith(callout)
      })
      endnotes('section').append(notesList)
      endnotesComponent.content = endnotes('body').html()
    } else {
      const notesList = chapterEndnotes('<ol/>').attr(
        'class',
        `${componentType}-notes`,
      )
      let noteNumberChpEnd = 0
      if (hasNotesOuter) {
        outerContainer('footnote').each((i, elem) => {
          const $elem = $(elem)
          const id = $elem.attr('id')
          noteNumberChpEnd += 1
          const content = `${$elem.html()}`

          const li = chapterEndnotes('<li/>').html(content)
          li.attr('id', `${bookComponent.id}-${id}`)
          notesList.append(li)
          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberChpEnd}</a>`,
          )

          $elem.replaceWith(callout)
        })
      }

      $('footnote').each((i, elem) => {
        const $elem = $(elem)

        const id = $elem.attr('id')
        noteNumberChpEnd += 1
        const content = `${$elem.html()}`

        const li = chapterEndnotes('<li/>').html(content)
        li.attr('id', `${bookComponent.id}-${id}`)
        notesList.append(li)
        const callout = $(
          `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberChpEnd}</a>`,
        )

        $elem.replaceWith(callout)
      })
      chapterEndnotes('aside').append(notesList)
    }
  }

  const bodyContent = $.html()
  outerContainer('section').append(bodyContent)
  if (notesType === 'chapterEnd') {
    if (chapterEndnotes('ol > li').length > 0) {
      outerContainer('section').append(chapterEndnotes('body').html())
    }
  }
  return { content: outerContainer('body').html(), hasMath }
}
