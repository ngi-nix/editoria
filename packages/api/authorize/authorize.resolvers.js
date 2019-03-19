const map = require('lodash/map')
const config = require('config')
const {
  Book,
  BookComponent,
  BookComponentState,
} = require('editoria-data-model/src').models

const {
  canAddBooks,
  canRemoveTeamMember,
  canViewAddTeamMember,
  editor,
  dashboard,
  bookBuilder,
  workFlowStages,
} = require('./consts')

const executeMultipleAuthorizeRules = async (ctx, value, rules) => {
  const permissions = await Promise.all(
    map(rules, (rule, variable) =>
      ctx.helpers
        .can(ctx.user, rule, value)
        .then(result => {
          const data = {}
          data[variable] = true
          return data
        })
        .catch(result => {
          const data = {}
          data[variable] = false
          return data
        }),
    ),
  )

  return permissions.reduce((r, c) => Object.assign(r, c), {})
}

const getDashBoardRules = async (_, args, ctx) => {
  const books = await Book.all()

  const canAddBook = await executeMultipleAuthorizeRules(
    ctx,
    {},
    { canAddBooks },
  )

  const canViewAddTeamMembers = await executeMultipleAuthorizeRules(
    ctx,
    {},
    { canViewAddTeamMember },
  )

  const bookRules = await Promise.all(
    map(books, async value => {
      const data = await executeMultipleAuthorizeRules(ctx, value, dashboard)
      const teamRoles = await Promise.all(
        map(Object.keys(config.get('authsome.teams')), async role => {
          const data = await executeMultipleAuthorizeRules(
            ctx,
            { id: value.id, role },
            {
              canRemoveTeamMember,
            },
          )
          return Object.assign({}, { role }, data)
        }),
      )

      return Object.assign({}, { id: value.id }, data, { teamRoles })
    }),
  )

  return {
    bookRules,
    canViewAddTeamMember: canViewAddTeamMembers.canViewAddTeamMember,
    canAddBooks: canAddBook.canAddBooks,
  }
}

const getBookBuilderRules = async (_, args, ctx) => {
  const book = await Book.find(args.id)
  const bookComponents = await BookComponent.findByField('book_id', args.id)

  const bookComponentsIds = bookComponents.map(component => component.id)

  const bookComponentState = await BookComponentState.query().whereIn(
    'book_component_id',
    bookComponentsIds,
  )

  const data = await executeMultipleAuthorizeRules(ctx, book, bookBuilder)
  const result = Object.assign({}, { id: book.id }, data)

  result.bookComponentStateRules = await Promise.all(
    map(bookComponentState, async value => {
      const data = await Promise.all(
        map(config.bookBuilder.stages, async v => {
          const data = await executeMultipleAuthorizeRules(
            ctx,
            {
              bookId: book.id,
              type: v.type,
              currentValues: value.workflowStages,
            },
            workFlowStages,
          )

          // const data = map(workFlowStages, key => {let data={}; data[key] = true; return data; })

          return Object.assign({}, { type: v.type }, data)
        }),
      )

      return Object.assign(
        {},
        { id: value.id, bookComponentId: value.bookComponentId },
        { stage: data },
      )
    }),
  )

  // console.log(result)

  return result
}

const getWaxRules = async (_, args, ctx) => {
  const bookComponent = await BookComponent.findOneByField('id', args.id)

  const { workflowStages } = await BookComponentState.query().whereIn(
    'book_component_id',
    [bookComponent.id],
  )

  bookComponent.workflowStages = workflowStages

  const data = await executeMultipleAuthorizeRules(ctx, bookComponent, editor)

  return Object.assign({}, data)
}

module.exports = {
  Query: {
    getWaxRules,
    getDashBoardRules,
    getBookBuilderRules,
  },
}
