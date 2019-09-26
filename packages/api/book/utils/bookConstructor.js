const map = require('lodash/map')
const groupBy = require('lodash/groupBy')
const forEach = require('lodash/forEach')
const findIndex = require('lodash/findIndex')
const find = require('lodash/find')
const {
  Book,
  BookTranslation,
  BookComponent,
  BookComponentTranslation,
  Division,
  BookComponentState,
} = require('editoria-data-model/src').models

const divisionTypeMapper = {
  Frontmatter: 'front',
  Body: 'body',
  Backmatter: 'back',
}

const eager = '[members.[user]]'

module.exports = async (bookId, ctx) => {
  const finalBook = {}
  const book = await Book.findById(bookId)

  const bookTranslation = await BookTranslation.query()
    .where('bookId', bookId)
    .andWhere('languageIso', 'en')
    .andWhere('deleted', false)

  const divisions = await Division.query()
    .where('bookId', bookId)
    .andWhere('deleted', false)

  const bookComponents = await BookComponent.query()
    .where('bookId', bookId)
    .andWhere('deleted', false)

  const bookComponentsWithState = await Promise.all(
    map(bookComponents, async bookComponent => {
      const bookComponentTranslation = await BookComponentTranslation.query()
        .where('bookComponentId', bookComponent.id)
        .andWhere('languageIso', 'en')
        .andWhere('deleted', false)
      const bookComponentState = await BookComponentState.query()
        .where('bookComponentId', bookComponent.id)
        .andWhere('deleted', false)

      return {
        id: bookComponent.id,
        divisionId: bookComponent.divisionId,
        content: bookComponentTranslation[0].content,
        title: bookComponentTranslation[0].title,
        componentType: bookComponent.componentType,
        includeInTOC: bookComponentState[0].includeInTOC,
        runningHeadersRight: bookComponentState[0].runningHeadersRight,
        runningHeadersLeft: bookComponentState[0].runningHeadersLeft,
      }
    }),
  )

  const bookComponentsWithDivision = map(
    bookComponentsWithState,
    bookComponent => ({
      ...bookComponent,
      division:
        divisionTypeMapper[
          find(divisions, { id: bookComponent.divisionId }).label
        ],
    }),
  )

  const bookComponentsWithNumber = map(
    bookComponentsWithDivision,
    bookComponent => {
      const divisionBookComponents = find(divisions, {
        id: bookComponent.divisionId,
      }).bookComponents

      const sortedBookComponentsInDivision = []
      for (let i = 0; i < divisionBookComponents.length; i += 1) {
        const found = find(bookComponentsWithDivision, {
          id: divisionBookComponents[i],
        })
        sortedBookComponentsInDivision.push(found)
      }

      const groupedByType = groupBy(
        sortedBookComponentsInDivision,
        'componentType',
      )

      const componentTypeNumber =
        findIndex(
          groupedByType[bookComponent.componentType],
          item => item.id === bookComponent.id,
        ) + 1

      return {
        ...bookComponent,
        number: componentTypeNumber,
      }
    },
  )

  const authorTeams = await ctx.connectors.Team.fetchAll(
    { objectId: bookId, role: 'author' },
    ctx,
    { eager },
  )

  let authors = []
  if (authorTeams[0] && authorTeams[0].members.length > 0) {
    authors = map(authorTeams[0].members, teamMember => {
      const { user } = teamMember
      return `${user.givenName} ${user.surname}`
    })
  }

  const bookMetadata = {
    publicationDate: book.publicationDate,
    edition: book.edition,
    copyrightStatement: book.copyrightStatement,
    copyrightYear: book.copyrightYear,
    copyrightHolder: book.copyrightHolder,
    isbn: book.isbn,
    issn: book.issn,
    issnL: book.issnL,
    license: book.license,
    authors: authors.length > 0 ? authors : null,
  }

  const bookDivisions = []

  for (let i = 0; i < book.divisions.length; i += 1) {
    const division = find(divisions, { id: book.divisions[i] })
    const tempDivision = {
      label: division.label,
      type: divisionTypeMapper[division.label],
      bookComponents: [],
    }
    forEach(division.bookComponents, bookComponentId => {
      tempDivision.bookComponents.push(
        find(bookComponentsWithNumber, { id: bookComponentId }),
      )
    })
    bookDivisions.push(tempDivision)
  }
  finalBook.title = bookTranslation[0].title
  finalBook.metadata = bookMetadata
  finalBook.divisions = bookDivisions
  return finalBook
}
