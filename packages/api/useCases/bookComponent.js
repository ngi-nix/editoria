// const findIndex = require('lodash/findIndex')
// const find = require('lodash/find')
// const flatten = require('lodash/flatten')
// const difference = require('lodash/difference')
// const concat = require('lodash/concat')
// const flattenDeep = require('lodash/flattenDeep')
// const groupBy = require('lodash/groupBy')
// const pullAll = require('lodash/pullAll')
// const map = require('lodash/flatMapDepth')
const map = require('lodash/map')
// const { convertDocx, extractFragmentProperties } = require('./util')

// const clone = require('lodash/clone')
const assign = require('lodash/assign')
const logger = require('@pubsweet/logger')
// const pubsweetServer = require('pubsweet-server')
// const { withFilter } = require('graphql-subscriptions')
// const { getPubsub } = require('pubsweet-server/src/graphql/pubsub')
// const crypto = require('crypto')

const {
  ApplicationParameter,
  BookComponentState,
  BookComponent,
  BookComponentTranslation,
  Division,
  // Book,
  // BookTranslation,
  // Lock,
} = require('editoria-data-model/src').models

const addBookComponent = async (divisionId, bookId, componentType) => {
  try {
    const applicationParameters = await ApplicationParameter.query().findOne({
      context: 'bookBuilder',
      area: 'stages',
    })

    if (!applicationParameters) {
      throw new Error(`application parameters do not exist`)
    }

    const { config: workflowStages } = applicationParameters

    let bookComponentWorkflowStages

    const division = await Division.findById(divisionId)

    if (!division) {
      throw new Error(`division with id ${divisionId} does not exists`)
    }

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
    }).save()

    logger.info(
      `New book component translation created with id ${translation.id}`,
    )
    const newBookComponents = division.bookComponents

    newBookComponents.push(createdBookComponent.id)

    const updatedDivision = await Division.query().patchAndFetchById(
      division.id,
      { bookComponents: newBookComponents },
    )

    logger.info(
      `Book component pushed to the array of division's book components [${updatedDivision.bookComponents}]`,
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
          uploading: false,
        },
        bookComponentWorkflowStages,
      ),
    ).save()

    logger.info(
      `New state created for the book component ${bookComponentState}`,
    )

    return createdBookComponent
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

const updateContent = async (bookComponentId, content) => {
  try {
    const bookComponentTranslation = await BookComponentTranslation.query().findOne(
      { bookComponentId },
    )

    const { id: translationId } = bookComponentTranslation

    logger.info(
      `The translation entry found for the book component with id ${bookComponentId}. The entry's id is ${translationId}`,
    )

    await BookComponentTranslation.query()
      .patch({ content })
      .where('id', translationId)
      .andWhere('languageIso', 'en')

    logger.info(
      `The translation entry updated for the book component with id ${bookComponentId} and entry's id ${translationId}`,
    )

    return BookComponent.findById(bookComponentId)
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
        pagination,
      },
    )

    logger.info(
      `book component track changes state changed from ${currentState.pagination} to ${updatedState.pagination} for book component with id ${bookComponentId}`,
    )

    return updatedState
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

module.exports = {
  addBookComponent,
  updateContent,
  toggleIncludeInTOC,
  updateComponentType,
  updateUploading,
  updateTrackChanges,
  updatePagination,
}
