const findIndex = require('lodash/findIndex')
const find = require('lodash/find')
const flatten = require('lodash/flatten')
const difference = require('lodash/difference')
const concat = require('lodash/concat')
const flattenDeep = require('lodash/flattenDeep')
const groupBy = require('lodash/groupBy')
const pullAll = require('lodash/pullAll')
// const map = require('lodash/flatMapDepth')
const map = require('lodash/map')
const { convertDocx, extractFragmentProperties } = require('./util')

const clone = require('lodash/clone')
const assign = require('lodash/assign')
const logger = require('@pubsweet/logger')
const pubsweetServer = require('pubsweet-server')
const { withFilter } = require('graphql-subscriptions')
const { getPubsub } = require('pubsweet-server/src/graphql/pubsub')
const crypto = require('crypto')

const {
  ApplicationParameter,
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
  BOOK_COMPONENT_TOC_UPDATED,
} = require('./consts')

const {
  pubsubManager,
  jobs: { connectToJobQueue },
} = pubsweetServer

const {
  useCaseAddBookComponent,
  useCaseUpdateBookComponentContent,
  useCaseUpdateUploading,
  useCaseToggleIncludeInTOC,
  useCaseUpdateComponentType,
  useCaseUpdateTrackChanges,
  useCaseUpdatePagination,
  useCaseLockBookComponent,
  useCaseUnlockBookComponent,
  useCaseUpdateWorkflowState,
} = require('../useCases')

const DOCX_TO_HTML = 'DOCX_TO_HTML'

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

const ingestWordFile = async (_, { bookComponentFiles }, context) => {
  const jobQueue = await connectToJobQueue()
  const pubsub = await getPubsub()
  console.log('bc', bookComponentFiles)

  const bookComponents = await Promise.all(
    bookComponentFiles.map(async bookComponentFile => {
      const { file, bookComponentId, bookId } = await bookComponentFile
      const { filename } = await file
      const title = filename.split('.')[0]

      const jobId = crypto.randomBytes(3).toString('hex')
      const pubsubChannel = `${DOCX_TO_HTML}.${context.user}.${jobId}`

      const contentPromise = convertDocx(file, pubsubChannel, pubsub, jobQueue)

      const createBookComponent = await contentPromise.then(async content => {
        let input = {}
        let id = bookComponentId
        if (!id) {
          const name = filename.replace(/\.[^/.]+$/, '')
          const { componentType, label } = extractFragmentProperties(name)

          const division = await Division.query().where({
            bookId,
            label,
          })

          input = {
            title: name,
            bookId,
            uploading: true,
            componentType,
            divisionId: division[0].id,
          }
          const newBookComponent = await addBookComponent(_, { input }, context)
          id = newBookComponent.id
        }

        const bookComponentState = await BookComponentState.query().where(
          'bookComponentId',
          id,
        )

        const { workflowStages } = bookComponentState[0]

        workflowStages[0].value = 1
        workflowStages[1].value = 0

        input = {
          id,
          title,
          content,
          uploading: false,
          workflowStages,
        }

        const updatedBookComponent = await updateContent(_, { input }, context)

        return [updatedBookComponent]
      })

      return createBookComponent
    }),
  )

  return flatten(bookComponents)
  /* eslint-enable */
}

const addBookComponent = async (_, { input }, ctx, info) => {
  try {
    const { divisionId, bookId, componentType, title } = input
    const pubsub = await pubsubManager.getPubsub()

    const newBookComponent = await useCaseAddBookComponent(
      divisionId,
      bookId,
      componentType,
      title,
    )

    pubsub.publish(BOOK_COMPONENT_ADDED, {
      bookComponentAdded: newBookComponent,
    })

    return newBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

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
  const bookComponentState = await BookComponentState.query().where(
    'bookComponentId',
    id,
  )
  await BookComponentState.query().patchAndFetchById(bookComponentState[0].id, {
    runningHeadersRight: title,
    runningHeadersLeft: title,
  })
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
    const bookComponent = await BookComponent.findById(id)
    if (bookComponent.componentType === 'toc') {
      throw new Error(
        'You cannot delete a component with type Table of Contents',
      )
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
      `Division's book component array before [${componentDivision.bookComponents}]`,
    )
    logger.info(
      `Division's book component array after cleaned [${updatedDivision.bookComponents}]`,
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

// Could be implemented in the future
const archiveBookComponent = async (_, args, ctx) => {}

const updateWorkflowState = async (_, { input }, ctx) => {
  try {
    const { id, workflowStages } = input
    const pubsub = await pubsubManager.getPubsub()

    const bookComponentState = await BookComponentState.query().findOne({
      bookComponentId: id,
    })

    if (!bookComponentState) {
      throw new Error(
        `book component state does not exists for the book component with id ${id}`,
      )
    }

    const currentAndUpdate = {
      current: bookComponentState,
      update: { workflowStages },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    await useCaseUpdateWorkflowState(id, workflowStages)

    const isReviewing = find(workflowStages, { type: 'review' }).value === 0
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

const unlockBookComponent = async (_, { input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const { id } = input

    await useCaseUnlockBookComponent(id)

    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
      bookComponentLockUpdated: updatedBookComponent,
    })

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const lockBookComponent = async (_, { input }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const { id } = input

    await useCaseLockBookComponent(id, ctx.user)

    const bookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
      bookComponentLockUpdated: bookComponent,
    })

    return bookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateContent = async (_, { input }, ctx) => {
  const { id, content, title, workflowStages, uploading } = input
  const pubsub = await pubsubManager.getPubsub()

  const bookComponentTranslation = await BookComponentTranslation.query().where(
    'bookComponentId',
    id,
  )
  await BookComponentTranslation.query()
    .patch({ content, title })
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
  try {
    const { id, pagination } = input
    const pubsub = await pubsubManager.getPubsub()

    const currentState = await BookComponentState.query().findOne({
      bookComponentId: id,
    })

    if (!currentState) {
      throw new Error(
        `no state info exists for the book component with id ${id}`,
      )
    }

    const currentAndUpdate = {
      current: currentState,
      update: { pagination },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    await useCaseUpdatePagination(id, pagination)

    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_PAGINATION_UPDATED, {
      bookComponentPaginationUpdated: updatedBookComponent,
    })

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateTrackChanges = async (_, { input }, ctx) => {
  try {
    const { id, trackChangesEnabled } = input
    const pubsub = await pubsubManager.getPubsub()

    const currentState = await BookComponentState.query().findOne({
      bookComponentId: id,
    })

    if (!currentState) {
      throw new Error(
        `no state info exists for the book component with id ${id}`,
      )
    }

    const currentAndUpdate = {
      current: currentState,
      update: { trackChangesEnabled },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    await useCaseUpdateTrackChanges(id, trackChangesEnabled)

    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_TRACK_CHANGES_UPDATED, {
      bookComponentTrackChangesUpdated: updatedBookComponent,
    })

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateUploading = async (_, { input }, ctx) => {
  try {
    const { id, uploading } = input
    const pubsub = await pubsubManager.getPubsub()

    const currentState = await BookComponentState.query().findOne({
      bookComponentId: id,
    })

    if (!currentState) {
      throw new Error(
        `no state info exists for the book component with id ${id}`,
      )
    }

    const currentAndUpdate = {
      current: currentState,
      update: { uploading },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    await useCaseUpdateUploading(id, uploading)

    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
      bookComponentUploadingUpdated: updatedBookComponent,
    })

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateComponentType = async (_, { input }, ctx) => {
  try {
    const { id, componentType } = input
    const pubsub = await pubsubManager.getPubsub()

    const updatedBookComponent = await useCaseUpdateComponentType(
      id,
      componentType,
    )

    pubsub.publish(BOOK_COMPONENT_TYPE_UPDATED, {
      bookComponentTypeUpdated: updatedBookComponent,
    })

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const toggleIncludeInTOC = async (_, { input }, ctx) => {
  try {
    const { id } = input
    const pubsub = await pubsubManager.getPubsub()

    await useCaseToggleIncludeInTOC(id)

    const updatedBookComponent = await BookComponent.query().findOne({ id })

    pubsub.publish(BOOK_COMPONENT_TOC_UPDATED, {
      bookComponentTOCToggled: updatedBookComponent,
    })

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
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
    updateUploading,
    updateTrackChanges,
    updateComponentType,
    toggleIncludeInTOC,
  },
  BookComponent: {
    async title(bookComponent, _, ctx) {
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
      const bookTranslation = await BookTranslation.query()
        .where('bookId', book.id)
        .andWhere('languageIso', 'en')

      return bookTranslation[0].title
    },
    async nextBookComponent(bookComponent, _, ctx) {
      const orderedComponent = await getOrderedBookComponents(bookComponent)

      const excludeBookComponent = await BookComponent.query()
        .whereIn('componentType', ['toc', 'endnotes'])
        .map(bookComponent => bookComponent.id)

      const newOrderedComponent = difference(
        orderedComponent,
        excludeBookComponent,
      )
      const current = newOrderedComponent.findIndex(
        comp => comp === bookComponent.id,
      )
      try {
        const next = newOrderedComponent[current + 1]
        const nextBookComponent = await BookComponent.findById(next)
        return nextBookComponent
      } catch (e) {
        return null
      }
    },
    async runningHeadersRight(bookComponent, _, ctx) {
      const bookComponentState = await bookComponent.getBookComponentState()
      return bookComponentState.runningHeadersRight
    },
    async runningHeadersLeft(bookComponent, _, ctx) {
      const bookComponentState = await bookComponent.getBookComponentState()
      return bookComponentState.runningHeadersLeft
    },
    async prevBookComponent(bookComponent, _, ctx) {
      const orderedComponent = await getOrderedBookComponents(bookComponent)
      const excludeBookComponent = await BookComponent.query()
        .whereIn('componentType', ['toc', 'endnotes'])
        .map(bookComponent => bookComponent.id)

      const newOrderedComponent = difference(
        orderedComponent,
        excludeBookComponent,
      )
      const current = newOrderedComponent.findIndex(
        comp => comp === bookComponent.id,
      )

      try {
        const prev = newOrderedComponent[current - 1]
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

    async includeInToc(bookComponent, _, ctx) {
      const state = await bookComponent.getBookComponentState()
      return state.includeInToc
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
    bookComponentTOCToggled: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_TOC_UPDATED)
      },
    },
  },
}
