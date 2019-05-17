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
  canViewFragmentEdit,
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
  await ctx.connectors.UserLoader.model.userTeams.clear()

  const books = await Book.query().where({ deleted: false })

  const canAddBook = await executeMultipleAuthorizeRules(
    ctx,
    {},
    { canAddBooks },
  )

  const bookRules = await Promise.all(
    map(books, async value => {
      const data = await executeMultipleAuthorizeRules(ctx, value, dashboard)

      return Object.assign({}, { id: value.id }, data)
    }),
  )

  return {
    bookRules,
    canAddBooks: canAddBook.canAddBooks,
  }
}

const getBookBuilderRules = async (_, args, ctx) => {
  await ctx.connectors.UserLoader.model.userTeams.clear()
  const book = await Book.find(args.id)
  const bookComponents = await BookComponent.query().where({
    deleted: false,
    bookId: args.id,
  })

  const bookComponentsIds = bookComponents.map(component => component.id)

  const bookComponentState = await BookComponentState.query().whereIn(
    'book_component_id',
    bookComponentsIds,
  )

  const canViewAddTeamMembers = await executeMultipleAuthorizeRules(
    ctx,
    {},
    { canViewAddTeamMember },
  )

  const teamRoles = await Promise.all(
    map(Object.keys(config.get('authsome.teams')), async role => {
      const data = await executeMultipleAuthorizeRules(
        ctx,
        { id: book.id, role },
        {
          canRemoveTeamMember,
        },
      )
      return Object.assign({}, { role }, data)
    }),
  )

  const data = await executeMultipleAuthorizeRules(ctx, book, bookBuilder)

  const result = Object.assign(
    {},
    { id: book.id },
    { canViewAddTeamMember: canViewAddTeamMembers.canViewAddTeamMember },
    { teamRoles },
    data,
  )

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

      const canViewFragmentEdits = await executeMultipleAuthorizeRules(
        ctx,
        Object.assign({}, { bookId: book.id }, value),
        { canViewFragmentEdit },
      )

      return Object.assign(
        {},
        {
          id: value.id,
          bookComponentId: value.bookComponentId,
          canViewFragmentEdit: canViewFragmentEdits.canViewFragmentEdit,
        },
        { stage: data },
      )
    }),
  )

  return result
}

const getWaxRules = async (_, args, ctx) => {
  await ctx.connectors.UserLoader.model.userTeams.clear()
  const bookComponent = await BookComponent.findOneByField('id', args.id)

  const { workflowStages } = await BookComponentState.findOneByField(
    'book_component_id',
    bookComponent.id,
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
