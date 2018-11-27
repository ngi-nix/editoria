const findIndex = require('lodash/findIndex')
const groupBy = require('lodash/groupBy')
const map = require('lodash/flatMapDepth')
const get = require('lodash/get')
const assign = require('lodash/assign')
const config = require('config')

const getBookComponent = async (_, args, ctx) => {
  const bookComponent = await ctx.models.bookComponent
    .findById(args.input.id)
    .exec()

  if (!bookComponent) {
    throw new Error(`Book Component with id: ${args.input.id} does not exist`)
  }

  return bookComponent
}

// TODO: Pending implementation
const ingestWordFile = async (_, args, ctx) => {
  // bookComponentState -> update uploading to true
}

const addBookComponent = async (_, args, ctx) => {
  const bookBuilder = get(config, 'bookBuilder')
  const workflowStages = get(bookBuilder, 'stages')
  let bookComponentWorkflowStages

  const division = await ctx.models.division
    .findByFields({ bookId: args.input.bookId, label: args.input.division })
    .exec()
  const newBookComponent = {
    bookId: args.input.bookId,
    componentType: args.input.componentType,
    divisionId: division.id,
    archived: false,
    deleted: false,
    pagination: {
      left: false,
      right: false,
    },
  }
  const createdBookComponent = await ctx.models.bookComponent
    .create(newBookComponent)
    .exec()

  await ctx.models.bookComponentTranslation
    .create({
      bookComponentId: createdBookComponent.id,
      langISO: 'en',
      title: args.input.title,
      content: '',
    })
    .exec()
  await ctx.models.division
    .update({
      id: division.id,
      bookComponents: division.bookComponents.push(createdBookComponent.id),
    })
    .exec()

  if (workflowStages) {
    bookComponentWorkflowStages = {
      workflowStages: map(workflowStages, stage => ({
        type: stage.type,
        label: stage.name,
        value: -1,
      })),
    }
  }

  await ctx.models.bookComponentState
    .create(
      assign(
        {},
        {
          bookComponentId: createdBookComponent.id,
          trackChangesEnabled: false,
          uploading: false,
        },
        bookComponentWorkflowStages,
      ),
    )
    .exec()

  return createdBookComponent
}

const renameBookComponent = async (_, args, ctx) => {
  await ctx.models.bookComponentTranslation
    .update({
      bookComponentId: args.input.id,
      langISO: 'en',
      title: args.input.title,
    })
    .exec()
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const deleteBookComponent = async (_, args, ctx) => {
  await ctx.models.bookComponent
    .update({
      id: args.input.id,
      deleted: true,
    })
    .exec()
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const archiveBookComponent = async (_, args, ctx) => {
  await ctx.models.bookComponent
    .update({
      id: args.input.id,
      archived: true,
    })
    .exec()
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const updateWorkflowState = async (_, args, ctx) => {
  const bookComponentState = await ctx.models.bookComponentSate
    .findById({ bookComponentId: args.input.id })
    .exec()

  const { workflowStages } = bookComponentState
  workflowStages[
    findIndex(workflowStages, ['type', args.input.workflowStages.type])
  ].value = args.input.workflowStages.value

  await ctx.models.bookComponentSate
    .update({
      bookComponentId: args.input.id,
      workflowStages,
    })
    .exec()

  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const unlockBookComponent = (_, args, ctx) => {
  ctx.models.lock.delete({
    foreignId: args.input.id,
    userId: args.input.lock.userId,
  })
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const lockBookComponent = (_, args, ctx) => {
  ctx.models.lock.create({
    foreignId: args.input.id,
    userId: ctx.currentUser.id,
  })
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const updateContent = async (_, args, ctx) => {
  await ctx.models.bookComponentTranslation
    .update({
      bookComponentId: args.input.id,
      langISO: 'en',
      content: args.input.content,
    })
    .exec()
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const updatePagination = async (_, args, ctx) => {
  await ctx.models.bookComponent
    .update({
      id: args.input.id,
      pagination: args.input.pagination,
    })
    .exec()
  return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

module.exports = {
  Query: {
    getBookComponent,
  },
  Mutation: {
    ingestWordFile,
    addBookComponent,
    renameBookComponent,
    deleteBookComponent,
    archiveBookComponent,
    updateWorkflowState,
    updatePagination,
    unlockBookComponent,
    lockBookComponent,
    updateContent,
  },
  BookComponent: {
    async title(bookComponent, _, ctx) {
      const bookComponentTranslation = await ctx.models.bookComponentTranslation
        .findByFields({
          bookComponentId: bookComponent.id,
          langISO: 'en',
        })
        .exec()
      return bookComponentTranslation.title
    },
    async content(bookComponent, _, ctx) {
      const bookComponentTranslation = await ctx.models.bookComponentTranslation
        .findByFields({
          bookComponentId: bookComponent.id,
          langISO: 'en',
        })
        .exec()
      return bookComponentTranslation.content
    },
    async trackChanges(bookComponent, _, ctx) {
      const bookComponentState = await ctx.models.bookComponentState
        .findByBookComponentId({ id: bookComponent.id })
        .exec()
      return bookComponentState.trackChangesEnabled
    },
    async lock(bookComponent, _, ctx) {
      let locked = null

      const lock = await ctx.models.lock
        .findByForeignId({ foreignId: bookComponent.id })
        .exec()

      if (lock) {
        const user = await ctx.models.user.findById({ id: lock.userId }).exec()
        locked = { created: lock.created, username: user.username }
      }
      return locked
    },
    async componentTypeOrder(bookComponent, _, ctx) {
      const { componentType } = bookComponent
      const division = await ctx.models.division
        .findBookComponentId({ bookComponentId: bookComponent.id })
        .exec()
      const sortedPerDivision = map(division.bookComponents, async id =>
        ctx.models.bookComponent.findById({ id }).exec(),
      )
      const groupedByType = groupBy(sortedPerDivision, 'componentType')

      return findIndex(
        groupedByType[componentType],
        item => item.id === bookComponent.id,
      )
    },
    async uploading(bookComponent, _, ctx) {
      const bookComponentState = await ctx.models.bookComponentState
        .findByBookComponentId({ id: bookComponent.id })
        .exec()
      return bookComponentState.uploading
    },
    async workflowStages(bookComponent, _, ctx) {
      const bookComponentState = await ctx.models.bookComponentState
        .findByBookComponentId({ id: bookComponent.id })
        .exec()

      return bookComponentState.workflowStages || null
    },
  },
}
