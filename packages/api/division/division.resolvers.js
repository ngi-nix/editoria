const map = require('lodash/map')
const indexOf = require('lodash/indexOf')
const pullAll = require('lodash/pullAll')
const find = require('lodash/find')
const utils = require('../helpers/utils')
const config = require('config')
const {
  BookComponent,
  Division,
  Book,
} = require('editoria-data-model/src').models

const pubsweetServer = require('pubsweet-server')

const { pubsubManager } = pubsweetServer

const { BOOK_COMPONENT_ORDER_UPDATED } = require('./consts')

const updateBookComponentOrder = async (
  _,
  { targetDivisionId, bookComponentId, index },
  ctx,
) => {
  const bookComponent = await BookComponent.findById(bookComponentId)
  const sourceDivision = await Division.findById(bookComponent.divisionId)
  const found = indexOf(sourceDivision.bookComponents, bookComponentId)
  const book = await Book.findById(sourceDivision.bookId)
  const pubsub = await pubsubManager.getPubsub()
  if (sourceDivision.id === targetDivisionId) {
    const updatedBookComponents = utils.reorderArray(
      sourceDivision.bookComponents,
      bookComponentId,
      index,
      found,
    )
    await Division.query().patchAndFetchById(sourceDivision.id, {
      bookComponents: updatedBookComponents,
    })

    pubsub.publish(BOOK_COMPONENT_ORDER_UPDATED, {
      bookComponentOrderUpdated: book,
    })
  } else {
    sourceDivision.bookComponents.splice(found, 1)
    await Division.query().patchAndFetchById(sourceDivision.id, {
      bookComponents: sourceDivision.bookComponents,
    })
    const targetDivision = await Division.findById(targetDivisionId)
    const updatedTargetDivisionBookComponents = utils.reorderArray(
      targetDivision.bookComponents,
      bookComponentId,
      index,
    )
    const updatedDivision = await Division.query().patchAndFetchById(
      targetDivision.id,
      {
        bookComponents: updatedTargetDivisionBookComponents,
      },
    )
    const divisionConfig = find(config.bookBuilder.divisions, {
      name: updatedDivision.label,
    })
    await BookComponent.query().patchAndFetchById(bookComponentId, {
      divisionId: targetDivision.id,
      componentType: divisionConfig.defaultComponentType,
    })

    pubsub.publish(BOOK_COMPONENT_ORDER_UPDATED, {
      bookComponentOrderUpdated: book,
    })
  }
  return Book.findById(bookComponent.bookId)
}

module.exports = {
  Mutation: {
    updateBookComponentOrder,
  },
  Division: {
    async bookComponents(divisionId, _, ctx) {
      // const dbDivision = await Division.findById(divisionId)
      // if (dbDivision.bookComponents.length > 0) {
      //   const bookComponents = await Promise.all(
      //     map(dbDivision.bookComponents, async bookComponentId => {
      //       const dbBookComponent = await BookComponent.query()
      //         .where('id', bookComponentId)
      //         .andWhere('deleted', false)
      //       return dbBookComponent[0]
      //     }),
      //   )
      //   return pullAll(bookComponents, [undefined])
      // }
      // return []
      ctx.connectors.DivisionLoader.model.bookComponents.clear()
      return ctx.connectors.DivisionLoader.model.bookComponents.load(divisionId)
    },
    async label(divisionId, _, ctx) {
      const dbDivision = await Division.findById(divisionId)
      return dbDivision.label
    },
    async id(divisionId, _, ctx) {
      return divisionId
    },
  },
  Subscription: {
    bookComponentOrderUpdated: {
      subscribe: async () => {
        const pubsub = await pubsubManager.getPubsub()
        return pubsub.asyncIterator(BOOK_COMPONENT_ORDER_UPDATED)
      },
    },
  },
}
