const findIndex = require('lodash/findIndex')
const find = require('lodash/find')
const { transaction, raw } = require('objection')
const pullAll = require('lodash/pullAll')
const map = require('lodash/map')
const clone = require('lodash/clone')
const assign = require('lodash/assign')
const { logger, useTransaction } = require('@coko/server')

const {
  ApplicationParameter,
  BookComponentState,
  BookComponent,
  BookComponentTranslation,
  Division,
  Lock,
} = require('../../data-model/src').models

const { isEmpty } = require('../helpers/utils')

const getBookComponent = async (bookComponentId, options = {}) => {
  try {
    const { trx } = options
    logger.info(`>>> fetching book component with id ${bookComponentId}`)

    const bookComponent = await useTransaction(
      async tr =>
        BookComponent.query(tr).where({ id: bookComponentId, deleted: false }),
      { trx, passedTrxOnly: true },
    )

    if (bookComponent.length === 0) {
      throw new Error(
        `book component with id: ${bookComponentId} does not exist`,
      )
    }

    return bookComponent[0]
  } catch (e) {
    throw new Error(e)
  }
}

const updateBookComponent = async (bookComponentId, patch, options = {}) => {
  try {
    const { trx } = options
    logger.info(`>>> updating book component with id ${bookComponentId}`)

    return useTransaction(
      async tr =>
        BookComponent.query(tr).patchAndFetchById(bookComponentId, patch),
      {
        trx,
      },
    )
  } catch (e) {
    throw new Error(e)
  }
}
const addBookComponent = async (divisionId, bookId, componentType) => {
  try {
    return transaction(
      ApplicationParameter,
      BookComponent,
      BookComponentTranslation,
      BookComponentState,
      Division,
      async (
        ApplicationParameter,
        BookComponent,
        BookComponentTranslation,
        BookComponentState,
        Division,
      ) => {
        const applicationParameters = await ApplicationParameter.query().findOne(
          {
            context: 'bookBuilder',
            area: 'stages',
          },
        )

        if (!applicationParameters) {
          throw new Error(`application parameters do not exist`)
        }

        const { config: workflowStages } = applicationParameters

        let bookComponentWorkflowStages

        const newBookComponent = {
          bookId,
          componentType,
          divisionId,
          archived: false,
          deleted: false,
        }

        const createdBookComponent = await BookComponent.query().insert(
          newBookComponent,
        )

        logger.info(
          `new book component created with id ${createdBookComponent.id}`,
        )

        const translationData = {
          bookComponentId: createdBookComponent.id,
          languageIso: 'en',
        }

        if (componentType === 'endnotes') {
          translationData.title = 'Notes'
        }

        const translation = await BookComponentTranslation.query().insert(
          translationData,
        )

        logger.info(
          `new book component translation created with id ${translation.id}`,
        )

        await Division.query()
          .where('id', divisionId)
          .patch({
            book_components: raw(
              `book_components || '"${createdBookComponent.id}"'`,
            ),
          })

        if (workflowStages) {
          bookComponentWorkflowStages = {
            workflowStages: map(workflowStages, stage => ({
              type: stage.type,
              label: stage.title,
              value: -1,
            })),
          }
        }

        const bookComponentState = await BookComponentState.query().insert(
          assign(
            {},
            {
              bookComponentId: createdBookComponent.id,
              trackChangesEnabled: false,
              includeInToc: true,
              uploading: false,
            },
            bookComponentWorkflowStages,
          ),
        )

        logger.info(
          `new state created with id ${bookComponentState.id} for the book component with id ${createdBookComponent.id}`,
        )

        return createdBookComponent
      },
    )
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateContent = async (bookComponentId, content, languageIso) => {
  try {
    const bookComponentTranslation = await BookComponentTranslation.query().findOne(
      { bookComponentId, languageIso },
    )

    const { id: translationId } = bookComponentTranslation

    logger.info(
      `The translation entry found for the book component with id ${bookComponentId}. The entry's id is ${translationId}`,
    )

    const updatedContent = await BookComponentTranslation.query().patchAndFetchById(
      translationId,
      { content },
    )

    logger.info(
      `The translation entry updated for the book component with id ${bookComponentId} and entry's id ${translationId}`,
    )

    let shouldNotifyWorkflowChange = false

    if (isEmpty(bookComponentTranslation.content) && !isEmpty(content)) {
      const hasWorkflowConfig = await ApplicationParameter.query().findOne({
        context: 'bookBuilder',
        area: 'stages',
      })

      if (hasWorkflowConfig) {
        logger.info(`should update also workflow`)
        const bookComponentState = await BookComponentState.query().findOne({
          bookComponentId,
        })

        if (!bookComponentState) {
          throw new Error(
            `state does not exist for the book component with id ${bookComponentId}`,
          )
        }

        const { id, workflowStages } = bookComponentState

        const uploadStepIndex = findIndex(workflowStages, { type: 'upload' })
        const filePrepStepIndex = findIndex(workflowStages, {
          type: 'file_prep',
        })
        workflowStages[uploadStepIndex].value = 1
        workflowStages[filePrepStepIndex].value = 0

        const updatedState = await BookComponentState.query().patchAndFetchById(
          id,
          {
            workflowStages,
          },
        )

        if (!updatedState) {
          throw new Error(
            `workflow was not updated for the book component with id ${bookComponentId}`,
          )
        }
        shouldNotifyWorkflowChange = true
      }
    }

    return { updatedContent, shouldNotifyWorkflowChange }
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const toggleIncludeInTOC = async bookComponentId => {
  try {
    const currentSate = await BookComponentState.query().findOne({
      bookComponentId,
    })
    if (!currentSate) {
      throw new Error(
        `no state info exists for the book component with id ${bookComponentId}`,
      )
    }
    const { id, includeInToc: currentTOC } = currentSate
    logger.info(
      `Current state for the book component with id ${bookComponentId} found with id ${id}`,
    )
    const updatedState = await BookComponentState.query().patchAndFetchById(
      id,
      { includeInToc: !currentTOC },
    )
    logger.info(
      `Include in TOC value changed from ${currentTOC} to ${updatedState.includeInToc} for the book component with id ${bookComponentId}`,
    )
    return updatedState
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateComponentType = async (bookComponentId, componentType) => {
  try {
    const currentBookComponent = await BookComponent.findById(bookComponentId)

    if (!currentBookComponent) {
      throw new Error(
        `book component with id ${bookComponentId} does not exists`,
      )
    }

    logger.info(`book component with id ${bookComponentId} found`)

    if (currentBookComponent.componentType === 'toc') {
      throw new Error(
        'You cannot change the component type of the Table of Contents',
      )
    }

    const updatedBookComponent = await BookComponent.query().patchAndFetchById(
      bookComponentId,
      {
        componentType,
      },
    )
    logger.info(
      `component type changed from ${currentBookComponent.componentType} to ${updatedBookComponent.componentType} for book component with id ${bookComponentId}`,
    )
    return updatedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateUploading = async (bookComponentId, uploading) => {
  try {
    const currentState = await BookComponentState.query().findOne({
      bookComponentId,
    })

    if (!currentState) {
      throw new Error(
        `no state info exists for the book component with id ${bookComponentId}`,
      )
    }

    const { id } = currentState

    logger.info(
      `Current state for the book component with id ${bookComponentId} found with id ${id}`,
    )

    const updatedState = await BookComponentState.query().patchAndFetchById(
      id,
      {
        uploading,
      },
    )

    logger.info(
      `book component uploading state changed from ${currentState.uploading} to ${updatedState.uploading} for book component with id ${bookComponentId}`,
    )

    return updatedState
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateTrackChanges = async (bookComponentId, trackChangesEnabled) => {
  try {
    const currentState = await BookComponentState.query().findOne({
      bookComponentId,
    })

    if (!currentState) {
      throw new Error(
        `no state info exists for the book component with id ${bookComponentId}`,
      )
    }

    const { id } = currentState

    logger.info(
      `Current state for the book component with id ${bookComponentId} found with id ${id}`,
    )

    const updatedState = await BookComponentState.query().patchAndFetchById(
      id,
      {
        trackChangesEnabled,
      },
    )

    logger.info(
      `book component track changes state changed from ${currentState.trackChangesEnabled} to ${updatedState.trackChangesEnabled} for book component with id ${bookComponentId}`,
    )

    return updatedState
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updatePagination = async (bookComponentId, pagination) => {
  try {
    return BookComponent.query().patchAndFetchById(bookComponentId, {
      pagination,
    })
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const unlockBookComponent = async bookComponentId => {
  try {
    const locks = await Lock.query()
      .where('foreignId', bookComponentId)
      .andWhere('deleted', false)

    if (!locks || locks.length === 0) {
      throw new Error(
        `no lock found for the book component with id ${bookComponentId}`,
      )
    }

    let numberOfAffectedRows

    if (locks.length > 1) {
      logger.error(
        `multiple locks found for the book component with id ${bookComponentId}`,
      )

      numberOfAffectedRows = await Lock.query()
        .patch({
          deleted: true,
        })
        .whereIn(
          'id',
          map(locks, lock => lock.id),
        )

      if (numberOfAffectedRows === locks.length) {
        logger.info(
          `all the locks deleted for book component with id ${bookComponentId}`,
        )
      }
    }

    const { id } = locks[0]

    logger.info(
      `lock with id ${id} found for the book component with id ${bookComponentId}`,
    )

    numberOfAffectedRows = await Lock.query()
      .patch({
        deleted: true,
      })
      .where('id', id)

    logger.info(
      `lock with id ${id} deleted for book component with id ${bookComponentId}`,
    )

    return numberOfAffectedRows
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const lockBookComponent = async (bookComponentId, userId) => {
  try {
    const locks = await Lock.query()
      .where('foreignId', bookComponentId)
      .andWhere('deleted', false)

    if (locks.length > 1) {
      logger.error(
        `multiple locks found for the book component with id ${bookComponentId}`,
      )

      await Lock.query()
        .patch({
          deleted: true,
        })
        .whereIn(
          'id',
          map(locks, lock => lock.id),
        )

      throw new Error(
        `corrupted lock for the book component with id ${bookComponentId}, all locks deleted`,
      )
    }

    if (locks.length === 1) {
      if (locks[0].userId !== userId) {
        const errorMsg = `There is a lock already for this book component for the user with id ${locks[0].userId}`
        logger.error(errorMsg)
        throw new Error(errorMsg)
      }

      logger.info(
        `lock exists for book component with id ${bookComponentId} for the user with id ${userId}`,
      )

      return locks[0]
    }

    logger.info(
      `no existing lock found for book component with id ${bookComponentId}`,
    )

    const lock = await Lock.query().insert({
      foreignId: bookComponentId,
      foreignType: 'bookComponent',
      userId,
    })

    logger.info(
      `lock acquired for book component with id ${bookComponentId} for the user with id ${userId}`,
    )

    return lock
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

const updateWorkflowState = async (bookComponentId, workflowStages) => {
  try {
    const applicationParameters = await ApplicationParameter.query().findOne({
      context: 'bookBuilder',
      area: 'lockTrackChangesWhenReviewing',
    })

    if (!applicationParameters) {
      throw new Error(`application parameters do not exist`)
    }

    const { config: lockTrackChanges } = applicationParameters

    logger.info(
      `searching of book component state for the book component with id ${bookComponentId}`,
    )

    const bookComponentState = await BookComponentState.query().findOne({
      bookComponentId,
    })

    if (!bookComponentState) {
      throw new Error(
        `book component state does not exists for the book component with id ${bookComponentId}`,
      )
    }

    logger.info(`found book component state with id ${bookComponentState.id}`)

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
      bookComponentState.id,
      {
        ...update,
      },
    )

    logger.info(`book component state with id ${bookComponentState.id} updated`)

    return updatedBookComponentState
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const deleteBookComponent = async bookComponent => {
  try {
    const { id, componentType, divisionId } = bookComponent

    if (componentType === 'toc') {
      throw new Error(
        'you cannot delete a component with type Table of Contents',
      )
    }

    const deletedBookComponent = await BookComponent.query().patchAndFetchById(
      id,
      {
        deleted: true,
      },
    )

    await BookComponentState.query()
      .patch({
        deleted: true,
      })
      .where('bookComponentId', id)
    await BookComponentTranslation.query()
      .patch({
        deleted: true,
      })
      .where('bookComponentId', id)

    logger.info(`book component with id ${deletedBookComponent.id} deleted`)

    const componentDivision = await Division.findById(divisionId)

    if (!componentDivision) {
      throw new Error(
        `division does not exists for the book component with id ${id}`,
      )
    }

    const clonedBookComponents = clone(componentDivision.bookComponents)

    pullAll(clonedBookComponents, [id])

    const updatedDivision = await Division.query().patchAndFetchById(
      componentDivision.id,
      {
        bookComponents: clonedBookComponents,
      },
    )

    logger.info(
      `division's book component array before [${componentDivision.bookComponents}]`,
    )
    logger.info(
      `division's book component array after cleaned [${updatedDivision.bookComponents}]`,
    )

    return deletedBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const renameBookComponent = async (bookComponentId, title, languageIso) => {
  try {
    const bookComponentTranslation = await BookComponentTranslation.query().findOne(
      { bookComponentId, languageIso },
    )

    if (!bookComponentTranslation) {
      throw new Error(
        `translation entry does not exists for the book component with id ${bookComponentId}`,
      )
    }

    const updatedTranslation = await BookComponentTranslation.query().patchAndFetchById(
      bookComponentTranslation.id,
      { title },
    )

    logger.info(
      `the title of the book component with id ${bookComponentId} changed`,
    )

    const bookComponentState = await BookComponentState.query().findOne({
      bookComponentId,
    })

    if (!bookComponentState) {
      throw new Error(
        `book component state does not exists for the book component with id ${bookComponentId}, thus running headers will not be able to update with the new title`,
      )
    }

    await BookComponentState.query().patchAndFetchById(bookComponentState.id, {
      runningHeadersRight: title,
      runningHeadersLeft: title,
    })

    logger.info(
      `running headers updated for the book component with id ${bookComponentId}`,
    )

    return updatedTranslation
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

module.exports = {
  getBookComponent,
  updateBookComponent,
  addBookComponent,
  updateContent,
  toggleIncludeInTOC,
  updateComponentType,
  updateUploading,
  updateTrackChanges,
  updatePagination,
  unlockBookComponent,
  lockBookComponent,
  updateWorkflowState,
  deleteBookComponent,
  renameBookComponent,
}
