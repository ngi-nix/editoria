const findIndex = require('lodash/findIndex')
const find = require('lodash/find')
const difference = require('lodash/difference')
const concat = require('lodash/concat')
const flattenDeep = require('lodash/flattenDeep')
const groupBy = require('lodash/groupBy')
const pullAll = require('lodash/pullAll')
const map = require('lodash/map')
const path = require('path')
const { extractFragmentProperties, replaceImageSrc } = require('./util')
const BPromise = require('bluebird')

const { writeLocallyFromReadStream } = require('../helpers/utils')
const fs = require('fs-extra')

const { logger } = require('@coko/server')
const { pubsubManager } = require('@coko/server')
const crypto = require('crypto')

const {
  BookComponentState,
  BookComponent,
  BookComponentTranslation,
  Division,
  Book,
  BookTranslation,
  Lock,
  User,
} = require('../../data-model/src').models

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
  BOOK_COMPONENT_UNLOCKED_BY_ADMIN,
} = require('./consts')

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
  useCaseDeleteBookComponent,
  useCaseRenameBookComponent,
  useCaseXSweet,
} = require('../useCases')

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

const ingestWordFile = async (_, { bookComponentFiles }, ctx) => {
  try {
    const pubsub = await pubsubManager.getPubsub()
    const bookComponents = []
    await BPromise.mapSeries(bookComponentFiles, async bookComponentFile => {
      const { file, bookComponentId, bookId } = await bookComponentFile
      const { createReadStream, filename } = await file
      const title = filename.split('.')[0]
      const readerStream = createReadStream()

      const tempFilePath = path.join(`${process.cwd()}`, 'uploads', 'tmp')
      const randomFilename = `${crypto.randomBytes(32).toString('hex')}.docx`
      fs.ensureDir(tempFilePath)
      await writeLocallyFromReadStream(
        tempFilePath,
        randomFilename,
        readerStream,
        'utf-8',
      )
      let componentId = bookComponentId

      if (!bookComponentId) {
        const name = filename.replace(/\.[^/.]+$/, '')
        const { componentType, label } = extractFragmentProperties(name)

        const division = await Division.query().findOne({
          bookId,
          label,
        })

        if (!division) {
          throw new Error(
            `division with label ${label} does not exist for the book with id ${bookId}`,
          )
        }

        const newBookComponent = await useCaseAddBookComponent(
          division.id,
          bookId,
          componentType,
        )

        pubsub.publish(BOOK_COMPONENT_ADDED, {
          bookComponentAdded: newBookComponent,
        })

        componentId = newBookComponent.id
      }

      const uploading = true

      const currentComponentState = await BookComponentState.query().findOne({
        bookComponentId: componentId,
      })

      if (!currentComponentState) {
        throw new Error(
          `component state for the book component with id ${componentId} does not exist`,
        )
      }

      const currentAndUpdate = {
        current: currentComponentState,
        update: { uploading },
      }

      await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

      await useCaseUpdateUploading(componentId, uploading)

      await useCaseRenameBookComponent(componentId, title, 'en')

      const updatedBookComponent = await BookComponent.findById(componentId)
      bookComponents.push(updatedBookComponent)
      pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
        bookComponentUploadingUpdated: updatedBookComponent,
      })

      // await useCaseXSweet(componentId, `${tempFilePath}/${randomFilename}`)
      return useCaseXSweet(componentId, `${tempFilePath}/${randomFilename}`)
    })
    return bookComponents
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
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
  try {
    const { id, title } = input
    const pubsub = await pubsubManager.getPubsub()

    await useCaseRenameBookComponent(id, title, 'en')

    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_TITLE_UPDATED, {
      bookComponentTitleUpdated: updatedBookComponent,
    })

    logger.info('message BOOK_COMPONENT_TITLE_UPDATED broadcasted')

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const deleteBookComponent = async (_, { input }, ctx) => {
  try {
    const { id, deleted } = input
    const pubsub = await pubsubManager.getPubsub()
    const bookComponent = await BookComponent.findById(id)

    if (!bookComponent) {
      throw new Error(`book component with id ${id} does not exists`)
    }

    const currentAndUpdate = {
      current: bookComponent,
      update: { deleted },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    const deletedBookComponent = await useCaseDeleteBookComponent(bookComponent)

    pubsub.publish(BOOK_COMPONENT_DELETED, {
      bookComponentDeleted: deletedBookComponent,
    })

    logger.info('message BOOK_COMPONENT_DELETED broadcasted')

    return deletedBookComponent
  } catch (e) {
    logger.error(e.message)
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
    const lock = await Lock.query()
      .where('foreignId', id)
      .andWhere('deleted', false)
    await useCaseUnlockBookComponent(id)

    const updatedBookComponent = await BookComponent.findById(id)

    const user = await User.findById(ctx.user)

    if (user.admin && lock[0].userId !== ctx.user) {
      await pubsub.publish(BOOK_COMPONENT_UNLOCKED_BY_ADMIN, {
        bookComponentUnlockedByAdmin: {
          bookComponentId: id,
          unlocked: true,
        },
      })
      await pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
        bookComponentLockUpdated: updatedBookComponent,
      })
    } else {
      await pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
        bookComponentLockUpdated: updatedBookComponent,
      })
    }

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
  try {
    const { id, content } = input
    const pubsub = await pubsubManager.getPubsub()

    const {
      shouldNotifyWorkflowChange,
    } = await useCaseUpdateBookComponentContent(id, content, 'en')

    const updatedBookComponent = await BookComponent.findById(id)

    pubsub.publish(BOOK_COMPONENT_CONTENT_UPDATED, {
      bookComponentContentUpdated: updatedBookComponent,
    })

    logger.info('message BOOK_COMPONENT_CONTENT_UPDATED broadcasted')

    if (shouldNotifyWorkflowChange) {
      pubsub.publish(BOOK_COMPONENT_WORKFLOW_UPDATED, {
        bookComponentWorkflowUpdated: updatedBookComponent,
      })
      logger.info('message BOOK_COMPONENT_WORKFLOW_UPDATED broadcasted')
    }

    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updatePagination = async (_, { input }, ctx) => {
  try {
    const { id, pagination } = input
    const pubsub = await pubsubManager.getPubsub()

    const currentBookComponent = await BookComponent.findById(id)

    if (!currentBookComponent) {
      throw new Error(`book component with id ${id} does not exists`)
    }

    const currentAndUpdate = {
      current: currentBookComponent,
      update: { pagination },
    }

    await ctx.helpers.can(ctx.user, 'update', currentAndUpdate)

    const updatedBookComponent = await useCaseUpdatePagination(id, pagination)

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

      const excludeBookComponent = await BookComponent.query().whereIn(
        'componentType',
        ['toc', 'endnotes'],
      )
      const transformed = excludeBookComponent.map(
        bookComponent => bookComponent.id,
      )

      const newOrderedComponent = difference(orderedComponent, transformed)
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
      const excludeBookComponent = await BookComponent.query().whereIn(
        'componentType',
        ['toc', 'endnotes'],
      )
      const transformed = excludeBookComponent.map(
        bookComponent => bookComponent.id,
      )

      const newOrderedComponent = difference(orderedComponent, transformed)
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
      const division = await Division.findById(bookComponent.divisionId)
      return division.label
    },
    async divisionId(bookComponent, _, ctx) {
      return bookComponent.divisionId
    },
    async content(bookComponent, _, ctx) {
      const bookComponentTranslation = await BookComponentTranslation.query()
        .where('bookComponentId', bookComponent.id)
        .andWhere('languageIso', 'en')
      const content = bookComponentTranslation[0].content || ''
      const hasContent = content.trim().length > 0
      if (hasContent) {
        return replaceImageSrc(bookComponentTranslation[0].content)
      }
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
        const user = await User.findById(lock[0].userId)
        locked = {
          created: lock[0].created,
          username: user.username,
          givenName: user.givenName,
          surname: user.surname,
          isAdmin: user.admin,
          userId: lock[0].userId,
          id: lock[0].id,
        }
      }
      return locked
    },
    async componentTypeOrder(bookComponent, _, ctx) {
      const { componentType } = bookComponent
      const sortedPerDivision = await ctx.connectors.DivisionLoader.model.bookComponents.load(
        bookComponent.divisionId,
      )
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
      subscribe: async (payload, variables, context, info) => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_LOCK_UPDATED)
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
    bookComponentUnlockedByAdmin: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_UNLOCKED_BY_ADMIN)
      },
    },
  },
}
