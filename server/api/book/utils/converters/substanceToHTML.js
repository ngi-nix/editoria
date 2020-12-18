const hljs = require('highlight.js')
const cheerio = require('cheerio')

module.exports = (
  container,
  bookComponent,
  notesType,
  tocComponent,
  endnotesComponent = undefined,
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

  const replaceWithBlockquote = className => (i, elem) => {
    const $elem = $(elem)

    const blockquote = $(`<blockquote class="${className}"/>`).append(
      $elem.contents(),
    )

    $elem.replaceWith(blockquote)
  }

  const replaceWithPre = className => (i, elem) => {
    const $elem = $(elem)
    const { source } = $elem[0].attribs
    let { language } = $elem[0].attribs
    if (language === 'htmlmixed') {
      language = 'html'
    }
    const highLighter = hljs.highlight(language, source)
    const pre = $(`<pre class="${language}"/>`).append(highLighter.value)

    $elem.replaceWith(pre)
  }

  const replaceWithText = (i, elem) => {
    const $elem = $(elem)

    $elem.replaceWith($elem.text())
  }

  const replaceWithParagraph = (className = undefined) => (i, elem) => {
    const $elem = $(elem)
    const p = $('<p/>')
    if (className) {
      p.attr('class', className).html($elem.html())

      $elem.replaceWith(p)
      if (className === 'cst') {
        outerContainer('header').append(p)
        $elem.remove()
      }
    } else {
      p.attr('class', elem.attribs.class).html($elem.html())
      $elem.replaceWith(p)
    }
  }
  const replaceWithSpan = (className = undefined) => (i, elem) => {
    const $elem = $(elem)
    const span = $('<span/>')

    span.attr('class', elem.attribs.class).html($elem.html())
    $elem.replaceWith(span)
  }
  const replaceWithH1 = className => (i, elem) => {
    const $elem = $(elem)

    const h1 = $('<h1/>')
      .attr('class', className)
      .html($elem.html())

    $elem.replaceWith(h1)
    if (className === 'ct') {
      outerContainer('header').append(h1)
      $elem.remove()
    }
  }
  const replaceWithList = className => (i, elem) => {
    const $elem = $(elem)

    const list = $('<ol/>')
      .attr('class', className)
      .append($elem.contents())

    $elem.replaceWith(list)
  }

  // replace custom HTML elements
  $('extract').each(replaceWithBlockquote('ex')) // delete when xsweet is updated
  $('extract-prose').each(replaceWithBlockquote('ex'))
  $('extract-poetry').each(replaceWithBlockquote('px'))
  $('epigraph-poetry').each(replaceWithBlockquote('sepo'))
  $('epigraph-prose').each(replaceWithBlockquote('sep'))
  $('bibliography-entry').each(replaceWithParagraph('bibliography-entry'))
  $('glossary').each(replaceWithParagraph('glossary'))
  $('author').each(replaceWithParagraph('author'))
  $('dedication').each(replaceWithParagraph('dedication'))
  $('half-title').each(replaceWithParagraph('half-title'))
  $('publisher').each(replaceWithParagraph('publisher'))
  $('signature').each(replaceWithParagraph('signature'))
  $('series-editor').each(replaceWithParagraph('series-editor'))
  $('series-title').each(replaceWithParagraph('series-title'))
  $('custom-block').each(replaceWithParagraph())
  $('custom-inline').each(replaceWithSpan())
  $('comment').each(replaceWithText)
  $('chapter-title').each(replaceWithH1('ct'))
  $('chapter-subtitle').each(replaceWithParagraph('cst'))
  $('source-note').each(replaceWithParagraph('exsn'))
  $('ol[styling="qa"]').each(replaceWithList('di'))
  $('ol[styling="unstyled"]').each(replaceWithList('none'))
  $('script').each(replaceWithPre('pre'))

  // accept or remove "track-change" elements
  $('track-change').each((i, elem) => {
    const $elem = $(elem)

    if ($elem.attr('status') === 'delete') {
      $elem.replaceWith($elem.text())
    } else {
      $elem.remove()
    }
  })
  $('highlighter').each((i, elem) => {
    const $elem = $(elem)
    $elem.replaceWith($elem.text())
  })
  $('ornament').each((i, elem) => {
    const $elem = $(elem)
    const hr = $('<hr>')
    $elem.replaceWith(hr)
  })
  $('inline-note').each((i, elem) => {
    const $elem = $(elem)
    const number = $elem.attr('number')
    const sanitized = `[note ${number}]`
    $elem.replaceWith(sanitized)
  })

  const hasNotesOuter = outerContainer('note').length > 0
  const hasNotesInner = $('note').length > 0

  if (hasNotesInner) {
    if (notesType === 'footnotes') {
      let noteNumberFoot = 0
      if (hasNotesOuter) {
        // if notes exist in header area. this  should be done in a better way
        outerContainer('note').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('data-id')
          const element = $('#notes').find($(`#container-${id}`))
          noteNumberFoot += 1
          let content = ''

          for (let i = 0; i < element.children().length; i += 1) {
            const currentElement = $(element.children().get(i))
            content += `${currentElement.html()}`
          }

          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberFoot}</a><span class="footnote" id="${bookComponent.id}-${id}">${content}</span>`,
          )

          $elem.replaceWith(callout)
        })
      }

      $('note').each((i, elem) => {
        const $elem = $(elem)

        const id = $elem.attr('data-id')
        const element = $('#notes').find($(`#container-${id}`))
        noteNumberFoot += 1
        let content = ''

        for (let i = 0; i < element.children().length; i += 1) {
          const currentElement = $(element.children().get(i))
          content += `${currentElement.html()}`
        }

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
        outerContainer('note').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('data-id')
          noteNumberEnd += 1
          const element = $('#notes').find($(`#container-${id}`))
          let content = ''

          for (let i = 0; i < element.children().length; i += 1) {
            const currentElement = $(element.children().get(i))
            if (i < element.children().length - 1) {
              content += `${currentElement.html()}<br>`
            } else {
              content += `${currentElement.html()}`
            }
          }
          const li = endnotes('<li/>').html(content)
          li.attr('id', `${bookComponent.id}-${id}`)
          notesList.append(li)
          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberEnd}</a>`,
          )

          $elem.replaceWith(callout)
        })
      }

      $('note').each((i, elem) => {
        const $elem = $(elem)

        const id = $elem.attr('data-id')
        noteNumberEnd += 1
        const element = $('#notes').find($(`#container-${id}`))
        let content = ''

        for (let i = 0; i < element.children().length; i += 1) {
          const currentElement = $(element.children().get(i))
          if (i < element.children().length - 1) {
            content += `${currentElement.html()}<br>`
          } else {
            content += `${currentElement.html()}`
          }
        }
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
        outerContainer('note').each((i, elem) => {
          const $elem = $(elem)

          const id = $elem.attr('data-id')
          noteNumberChpEnd += 1
          const element = $('#notes').find($(`#container-${id}`))
          let content = ''

          for (let i = 0; i < element.children().length; i += 1) {
            const currentElement = $(element.children().get(i))
            if (i < element.children().length - 1) {
              content += `${currentElement.html()}`
            } else {
              content += `${currentElement.html()}`
            }
          }
          const li = chapterEndnotes('<li/>').html(content)
          li.attr('id', `${bookComponent.id}-${id}`)
          notesList.append(li)
          const callout = outerContainer(
            `<a class="note-callout" href="#${bookComponent.id}-${id}">${noteNumberChpEnd}</a>`,
          )

          $elem.replaceWith(callout)
        })
      }

      $('note').each((i, elem) => {
        const $elem = $(elem)

        const id = $elem.attr('data-id')
        noteNumberChpEnd += 1
        const element = $('#notes').find($(`#container-${id}`))
        let content = ''

        for (let i = 0; i < element.children().length; i += 1) {
          const currentElement = $(element.children().get(i))
          if (i < element.children().length - 1) {
            content += `${currentElement.html()}`
          } else {
            content += `${currentElement.html()}`
          }
        }
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
  $('#notes').remove()

  const bodyContent = $('#main').contents()
  outerContainer('section').append(bodyContent)
  if (notesType === 'chapterEnd') {
    if (chapterEndnotes('ol > li').length > 0) {
      outerContainer('section').append(chapterEndnotes('body').html())
    }
  }
  return outerContainer('body').html()
}