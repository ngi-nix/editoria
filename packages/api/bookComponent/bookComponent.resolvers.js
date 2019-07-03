const findIndex = require('lodash/findIndex')
const find = require('lodash/find')
const concat = require('lodash/concat')
const flattenDeep = require('lodash/flattenDeep')
const groupBy = require('lodash/groupBy')
const pullAll = require('lodash/pullAll')
// const map = require('lodash/flatMapDepth')
const keys = require('lodash/keys')
const map = require('lodash/map')
const forEach = require('lodash/forEach')
const clone = require('lodash/clone')
const get = require('lodash/get')
const assign = require('lodash/assign')
const config = require('config')
const logger = require('@pubsweet/logger')
const pubsweetServer = require('pubsweet-server')
const { withFilter } = require('graphql-subscriptions')

const {
  BookComponentState,
  BookComponent,
  BookComponentTranslation,
  Division,
  Book,
  BookTranslation,
  Lock,
} = require('editoria-data-model/src').models

const {
  BOOK_COMPONENT_ADDED,
  BOOK_COMPONENT_DELETED,
  BOOK_COMPONENT_PAGINATION_UPDATED,
  BOOK_COMPONENT_WORKFLOW_UPDATED,
  BOOK_COMPONENT_TRACK_CHANGES_UPDATED,
  BOOK_COMPONENT_TITLE_UPDATED,
  BOOK_COMPONENT_CONTENT_UPDATED,
  BOOK_COMPONENT_UPLOADING_UPDATED,
  BOOK_COMPONENT_LOCK_UPDATED,
  BOOK_COMPONENT_TYPE_UPDATED,
} = require('./consts')

const { pubsubManager } = pubsweetServer

const getOrderedBookComponents = async bookComponent => {
  const divisions = await Division.findByField(
    'bookId',
    bookComponent.bookId,
  ).orderByRaw(
    `label='${'Frontmatter'}' desc, label='${'Body'}' desc, label='${'Backmatter'}' desc`,
  )
  const orderedComponent = flattenDeep(
    concat([...map(divisions, division => division.bookComponents)]),
  )

  return orderedComponent
}

const getBookComponent = async (_, { id }, ctx) => {
  const bookComponent = await BookComponent.findById(id)
  if (!bookComponent) {
    throw new Error(`Book Component with id: ${id} does not exist`)
  }
  return bookComponent
}

// TODO: Pending implementation
const ingestWordFile = async (_, { files }, ctx) => {
  //
}

const addBookComponent = async (_, args, ctx, info) => {
  const { divisionId, bookId, componentType, title, uploading } = args.input
  const bookBuilder = get(config, 'bookBuilder')
  const workflowStages = get(bookBuilder, 'stages')
  let bookComponentWorkflowStages

  try {
    const pubsub = await pubsubManager.getPubsub()
    const division = await Division.findById(divisionId)
    logger.info(
      `Division which will hold the book found with id ${division.id}`,
    )
    const newBookComponent = {
      bookId,
      componentType,
      divisionId,
      archived: false,
      deleted: false,
    }
    const createdBookComponent = await new BookComponent(
      newBookComponent,
    ).save()

    logger.info(`New book component created with id ${createdBookComponent.id}`)
    const translation = await new BookComponentTranslation({
      bookComponentId: createdBookComponent.id,
      languageIso: 'en',
      title,
    }).save()

    logger.info(
      `New book component translation created with id ${translation.id}`,
    )
    const newBookComponents = division.bookComponents

    // forEach(division.bookComponents, bookComponent => {
    //   newBookComponents.push(bookComponent)
    // })
    newBookComponents.push(createdBookComponent.id)

    const updatedDivision = await Division.query().patchAndFetchById(
      division.id,
      { bookComponents: newBookComponents },
    )

    logger.info(
      `Book component pushed to the array of division's book components [${
        updatedDivision.bookComponents
      }]`,
    )
    if (workflowStages) {
      bookComponentWorkflowStages = {
        workflowStages: map(workflowStages, stage => ({
          type: stage.type,
          label: stage.title,
          value: -1,
        })),
      }
    }

    const bookComponentState = await new BookComponentState(
      assign(
        {},
        {
          bookComponentId: createdBookComponent.id,
          trackChangesEnabled: false,
          uploading: uploading || false,
        },
        bookComponentWorkflowStages,
      ),
    ).save()
    logger.info(
      `New state created for the book component ${bookComponentState}`,
    )
    pubsub.publish(BOOK_COMPONENT_ADDED, {
      bookComponentAdded: createdBookComponent,
    })
    return createdBookComponent
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const addBookComponents = async (_, { input }, ctx, info) => {
  const bookBuilder = get(config, 'bookBuilder')
  const workflowStages = get(bookBuilder, 'stages')
  let bookComponentWorkflowStages

  try {
    const pubsub = await pubsubManager.getPubsub()
    const createdBookComponents = await Promise.all(
      map(
        input,
        async ({ divisionId, bookId, componentType, title, uploading }) => {
          const newBookComponent = {
            bookId,
            componentType,
            divisionId,
            archived: false,
            deleted: false,
          }
          const bookComponent = await new BookComponent(newBookComponent).save()
          await new BookComponentTranslation({
            bookComponentId: bookComponent.id,
            languageIso: 'en',
            title,
          }).save()

          if (workflowStages) {
            bookComponentWorkflowStages = {
              workflowStages: map(workflowStages, stage => ({
                type: stage.type,
                label: stage.title,
                value: -1,
              })),
            }
          }

          await new BookComponentState(
            assign(
              {},
              {
                bookComponentId: bookComponent.id,
                trackChangesEnabled: false,
                uploading: uploading || false,
              },
              bookComponentWorkflowStages,
            ),
          ).save()
          return bookComponent
        },
      ),
    )
    const groupByDivision = groupBy(createdBookComponents, 'divisionId')
    const divisionIds = keys(groupByDivision)
    await Promise.all(
      map(divisionIds, async divisionId => {
        const division = await Division.findById(divisionId)
        const newBookComponents = []
        forEach(division.bookComponents, bookComponent => {
          newBookComponents.push(bookComponent)
        })
        forEach(groupByDivision[divisionId], bookComponent => {
          newBookComponents.push(bookComponent.id)
        })
        return Division.query().patchAndFetchById(divisionId, {
          bookComponents: newBookComponents,
        })
      }),
    )
    forEach(createdBookComponents, bookComponent => {
      pubsub.publish(BOOK_COMPONENT_ADDED, {
        bookComponentAdded: bookComponent,
      })
    })

    return createdBookComponents
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}
// TODO: Pending implementation
const renameBookComponent = async (_, { input }, ctx) => {
  const { id, title } = input
  const pubsub = await pubsubManager.getPubsub()
  const bookComponentTranslation = await BookComponentTranslation.query().where(
    'bookComponentId',
    id,
  )
  await BookComponentTranslation.query()
    .patch({ title })
    .where('id', bookComponentTranslation[0].id)
    .andWhere('languageIso', 'en')

  const updatedBookComponent = await BookComponent.findById(id)
  pubsub.publish(BOOK_COMPONENT_TITLE_UPDATED, {
    bookComponentTitleUpdated: updatedBookComponent,
  })

  return updatedBookComponent
}

const deleteBookComponent = async (_, { input }, ctx) => {
  const { id, deleted } = input
  try {
    const currentAndUpdate = {
      current: await BookComponent.findById(id),
      update: { deleted },
    }
    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    const pubsub = await pubsubManager.getPubsub()
    const deletedBookComponent = await BookComponent.query().patchAndFetchById(
      id,
      {
        deleted,
      },
    )
    logger.info(`Book component with id ${deletedBookComponent.id} deleted`)
    const { divisionId } = deletedBookComponent
    const componentDivision = await Division.findById(divisionId)
    const clonedBookComponents = clone(componentDivision.bookComponents)
    pullAll(clonedBookComponents, [id])
    const updatedDivision = await Division.query().patchAndFetchById(
      componentDivision.id,
      {
        bookComponents: clonedBookComponents,
      },
    )
    logger.info(
      `Division's book component array before [${
        componentDivision.bookComponents
      }]`,
    )
    logger.info(
      `Division's book component array after cleaned [${
        updatedDivision.bookComponents
      }]`,
    )
    pubsub.publish(BOOK_COMPONENT_DELETED, {
      bookComponentDeleted: deletedBookComponent,
    })
    return deletedBookComponent
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

// TODO: Pending implementation
const archiveBookComponent = async (_, args, ctx) => {
  // await ctx.models.bookComponent
  //   .update({
  //     id: args.input.id,
  //     archived: true,
  //   })
  //   .exec()
  // return ctx.models.bookComponent.findById({ id: args.input.id }).exec()
}

const updateWorkflowState = async (_, { input }, ctx) => {
  try {
    const { id, workflowStages } = input
    const pubsub = await pubsubManager.getPubsub()
    const bookBuilder = get(config, 'bookBuilder')
    const lockTrackChanges = get(bookBuilder, 'lockTrackChangesWhenReviewing')

    logger.info(
      `Searching of book component state for the book component with id ${id}`,
    )
    const bookComponentState = await BookComponentState.query().where(
      'bookComponentId',
      id,
    )
    logger.info(
      `Found book component state with id ${bookComponentState[0].id}`,
    )

    const currentAndUpdate = {
      current: bookComponentState[0],
      update: { workflowStages },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)
    const update = {}
    let isReviewing = false
    if (lockTrackChanges) {
      isReviewing = find(workflowStages, { type: 'review' }).value === 0
      if (isReviewing) {
        update.trackChangesEnabled = true
        update.workflowStages = workflowStages
      } else {
        update.workflowStages = workflowStages
      }
    }

    const updatedBookComponentState = await BookComponentState.query().patchAndFetchById(
      bookComponentState[0].id,
      {
        ...update,
      },
    )
    logger.info(
      `Book component state updated with workflow ${
        updatedBookComponentState.workflowStages
      }`,
    )
    const updatedBookComponent = await BookComponent.findById(id)
    pubsub.publish(BOOK_COMPONENT_WORKFLOW_UPDATED, {
      bookComponentWorkflowUpdated: updatedBookComponent,
    })

    if (isReviewing) {
      pubsub.publish(BOOK_COMPONENT_TRACK_CHANGES_UPDATED, {
        bookComponentTrackChangesUpdated: updatedBookComponent,
      })
    }
    return updatedBookComponent
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

// TODO: Pending implementation
const unlockBookComponent = async (_, { input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const { id } = input
    const locks = await Lock.query()
      .where('foreignId', id)
      .andWhere('deleted', false)

    await Lock.query().patchAndFetchById(locks[0].id, {
      deleted: true,
    })
    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
      bookComponentLockUpdated: updatedBookComponent,
    })
    return updatedBookComponent
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

// TODO: Pending implementation
const lockBookComponent = async (_, { input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const { id } = input
    const bookComponent = await BookComponent.findById(id)
    const lock = await Lock.query()
      .where('foreignId', id)
      .andWhere('deleted', false)
    if (lock.length > 0) {
      if (lock[0].userId === ctx.user) {
        return bookComponent
      }
      const errorMsg = `There is a lock already for this book component for the user with id ${
        lock[0].userId
      }`
      logger.error(errorMsg)
      throw new Error(errorMsg)
    }
    await new Lock({
      foreignId: id,
      foreignType: 'bookComponent',
      userId: ctx.user,
    }).save()
    pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
      bookComponentLockUpdated: bookComponent,
    })
    return bookComponent
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

// TODO: Pending implementation
const updateContent = async (_, { input }, ctx) => {
  const { id, content, workflowStages, uploading } = input
  const pubsub = await pubsubManager.getPubsub()

  const bookComponentTranslation = await BookComponentTranslation.query().where(
    'bookComponentId',
    id,
  )
  await BookComponentTranslation.query()
    .patch({ content })
    .where('id', bookComponentTranslation[0].id)
    .andWhere('languageIso', 'en')

  const updatedBookComponent = await BookComponent.findById(id)
  if (workflowStages) {
    const bookComponentState = await BookComponentState.query().where(
      'bookComponentId',
      id,
    )

    const currentAndUpdate = {
      current: bookComponentState[0],
      update: { workflowStages },
    }
    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    await BookComponentState.query().patchAndFetchById(
      bookComponentState[0].id,
      {
        workflowStages,
      },
    )
  }
  if (uploading !== undefined) {
    const bookComponentState = await BookComponentState.query().where(
      'bookComponentId',
      id,
    )
    const currentAndUpdate = {
      current: bookComponentState[0],
      update: { uploading },
    }
    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    await BookComponentState.query().patchAndFetchById(
      bookComponentState[0].id,
      {
        uploading,
      },
    )
  }
  pubsub.publish(BOOK_COMPONENT_CONTENT_UPDATED, {
    bookComponentContentUpdated: updatedBookComponent,
  })
  pubsub.publish(BOOK_COMPONENT_WORKFLOW_UPDATED, {
    bookComponentWorkflowUpdated: updatedBookComponent,
  })
  return updatedBookComponent
}

const updatePagination = async (_, { input }, ctx) => {
  const { id, pagination } = input
  const pubsub = await pubsubManager.getPubsub()

  const currentAndUpdate = {
    current: await BookComponent.findById(id),
    update: { pagination },
  }
  await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

  const updatedBookComponent = await BookComponent.query().patchAndFetchById(
    id,
    {
      pagination,
    },
  )
  pubsub.publish(BOOK_COMPONENT_PAGINATION_UPDATED, {
    bookComponentPaginationUpdated: updatedBookComponent,
  })
  return updatedBookComponent
}

const updateTrackChanges = async (_, { input }, ctx) => {
  const { id, trackChangesEnabled } = input
  const pubsub = await pubsubManager.getPubsub()

  const bookComponentState = await BookComponentState.query().where(
    'bookComponentId',
    id,
  )

  const currentAndUpdate = {
    current: bookComponentState[0],
    update: { trackChangesEnabled },
  }
  await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

  await BookComponentState.query().patchAndFetchById(bookComponentState[0].id, {
    trackChangesEnabled,
  })
  const updatedBookComponent = await BookComponent.findById(id)
  pubsub.publish(BOOK_COMPONENT_TRACK_CHANGES_UPDATED, {
    bookComponentTrackChangesUpdated: updatedBookComponent,
  })
  return updatedBookComponent
}

const updateUploading = async (_, { input }, ctx) => {
  const { id, uploading } = input
  const pubsub = await pubsubManager.getPubsub()

  const bookComponentState = await BookComponentState.query().where(
    'bookComponentId',
    id,
  )

  const currentAndUpdate = {
    current: bookComponentState[0],
    update: { uploading },
  }
  await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

  await BookComponentState.query().patchAndFetchById(bookComponentState[0].id, {
    uploading,
  })
  const updatedBookComponent = await BookComponent.findById(id)
  pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
    bookComponentUploadingUpdated: updatedBookComponent,
  })
  return updatedBookComponent
}
const updateComponentType = async (_, { input }, ctx) => {
  const { id, componentType } = input
  const pubsub = await pubsubManager.getPubsub()
  const updatedBookComponent = await BookComponent.query().patchAndFetchById(
    id,
    {
      componentType,
    },
  )
  pubsub.publish(BOOK_COMPONENT_TYPE_UPDATED, {
    bookComponentTypeUpdated: updatedBookComponent,
  })
  return updatedBookComponent
}

module.exports = {
  Query: {
    getBookComponent,
  },
  Mutation: {
    ingestWordFile,
    addBookComponent,
    addBookComponents,
    renameBookComponent,
    deleteBookComponent,
    archiveBookComponent,
    updateWorkflowState,
    updatePagination,
    unlockBookComponent,
    lockBookComponent,
    updateContent,
    updateUploading,
    updateTrackChanges,
    updateComponentType,
  },
  BookComponent: {
    async title(bookComponent, _, ctx) {
      // console.log('bokk', bookComponent)
      let { title } = bookComponent
      if (!title) {
        const bookComponentTranslation = await BookComponentTranslation.query()
          .where('bookComponentId', bookComponent.id)
          .andWhere('languageIso', 'en')
        title = bookComponentTranslation[0].title
      }
      return title
    },
    async bookId(bookComponent, _, ctx) {
      return bookComponent.bookId
    },
    async bookTitle(bookComponent, _, ctx) {
      const book = await Book.findById(bookComponent.bookId)
      //  console.log('book', book, bookComponent)
      const bookTranslation = await BookTranslation.query()
        .where('bookId', book.id)
        .andWhere('languageIso', 'en')
      //  console.log('booktit', bookTranslation)
      return bookTranslation[0].title
    },
    async nextBookComponent(bookComponent, _, ctx) {
      const orderedComponent = await getOrderedBookComponents(bookComponent)
      const current = orderedComponent.findIndex(
        comp => comp === bookComponent.id,
      )
      try {
        const next = orderedComponent[current + 1]
        const nextBookComponent = await BookComponent.findById(next)
        return nextBookComponent
      } catch (e) {
        return null
      }
    },
    async prevBookComponent(bookComponent, _, ctx) {
      const orderedComponent = await getOrderedBookComponents(bookComponent)
      const current = orderedComponent.findIndex(
        comp => comp === bookComponent.id,
      )

      try {
        const prev = orderedComponent[current - 1]
        const prevBookComponent = await BookComponent.findById(prev)
        return prevBookComponent
      } catch (e) {
        return null
      }
    },
    async divisionType(bookComponent, _, ctx) {
      // console.log('in here')
      const division = await Division.findById(bookComponent.divisionId)
      // console.log('division', division)
      return division.label
    },
    async divisionId(bookComponent, _, ctx) {
      return bookComponent.divisionId
    },
    async content(bookComponent, _, ctx) {
      const bookComponentTranslation = await BookComponentTranslation.query()
        .where('bookComponentId', bookComponent.id)
        .andWhere('languageIso', 'en')
      return bookComponentTranslation[0].content
    },
    async trackChangesEnabled(bookComponent, _, ctx) {
      const bookComponentState = await BookComponentState.query().where(
        'bookComponentId',
        bookComponent.id,
      )
      return bookComponentState[0].trackChangesEnabled
    },
    async hasContent(bookComponent, _, ctx) {
      const bookComponentTranslation = await BookComponentTranslation.query()
        .where('bookComponentId', bookComponent.id)
        .andWhere('languageIso', 'en')
      const content = bookComponentTranslation[0].content || ''
      const hasContent = content.trim().length > 0
      return hasContent
    },
    async lock(bookComponent, _, ctx) {
      let locked = null

      const lock = await Lock.query()
        .where('foreignId', bookComponent.id)
        .andWhere('deleted', false)
      if (lock.length > 0) {
        const user = await ctx.connectors.User.fetchOne(lock[0].userId, ctx)
        locked = {
          created: lock[0].created,
          username: user.username,
          givenName: user.givenName,
          surname: user.surname,
          isAdmin: user.admin,
          userId: lock[0].userId,
        }
      }
      return locked
    },
    async componentTypeOrder(bookComponent, _, ctx) {
      // return 1
      const { componentType } = bookComponent
      // const division = await Division.query().where(
      //   'id',
      //   bookComponent.divisionId,
      // )
      const sortedPerDivision = await ctx.connectors.DivisionLoader.model.bookComponents.load(
        bookComponent.divisionId,
      )
      // console.log('sorted', sortedPerDivision)
      // const sortedPerDivision = await BookComponent.query()
      //   .whereIn('id', division[0].bookComponents)
      //   .andWhere('deleted', false)
      const groupedByType = groupBy(
        pullAll(sortedPerDivision, [undefined]),
        'componentType',
      )

      return (
        findIndex(
          groupedByType[componentType],
          item => item.id === bookComponent.id,
        ) + 1
      )
    },
    async uploading(bookComponent, _, ctx) {
      ctx.connectors.BookComponentStateLoader.model.state.clear()
      const bookComponentState = await ctx.connectors.BookComponentStateLoader.model.state.load(
        bookComponent.id,
      )
      // const bookComponentState = await BookComponentState.query().where(
      //   'bookComponentId',
      //   bookComponent.id,
      // )
      return bookComponentState[0].uploading
    },
    async pagination(bookComponent, _, ctx) {
      return bookComponent.pagination
    },
    async workflowStages(bookComponent, _, ctx) {
      ctx.connectors.BookComponentStateLoader.model.state.clear()
      const bookComponentState = await ctx.connectors.BookComponentStateLoader.model.state.load(
        bookComponent.id,
      )
      return bookComponentState[0].workflowStages || null
    },
  },
  Subscription: {
    bookComponentAdded: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_ADDED)
      },
    },
    bookComponentDeleted: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_DELETED)
      },
    },
    bookComponentPaginationUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_PAGINATION_UPDATED)
      },
    },
    bookComponentWorkflowUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_WORKFLOW_UPDATED)
      },
    },
    bookComponentTrackChangesUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_TRACK_CHANGES_UPDATED)
      },
    },
    bookComponentTitleUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_TITLE_UPDATED)
      },
    },
    bookComponentContentUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_CONTENT_UPDATED)
      },
    },
    bookComponentUploadingUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_UPLOADING_UPDATED)
      },
    },
    bookComponentLockUpdated: {
      async subscribe(rootValue, args, context) {
        const pubsub = await pubsubManager.getPubsub()
        return withFilter(
          () => pubsub.asyncIterator(BOOK_COMPONENT_LOCK_UPDATED),
          (payload, variables) =>
            variables.bookComponentIds.includes(
              payload.bookComponentLockUpdated.id,
            ),
        )(rootValue, args, context)
      },
    },
    bookComponentTypeUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_TYPE_UPDATED)
      },
    },
  },
}
