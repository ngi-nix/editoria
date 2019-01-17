const map = require('lodash/map')
const indexOf = require('lodash/indexOf')
const pullAll = require('lodash/pullAll')
const utils = require('../helpers/utils')
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
    const updatedDivision = await Division.query().patchAndFetchById(
      sourceDivision.id,
      {
        bookComponents: updatedBookComponents,
      },
    )

    pubsub.publish(BOOK_COMPONENT_ORDER_UPDATED, {
      bookComponentOrderUpdated: book,
    })
  } else {
    await Division.query().patchAndFetchById(sourceDivision.id, {
      bookComponents: sourceDivision.bookComponents.splice(
        found,
        0,
        bookComponentId,
      ),
    })
    const targetDivision = Division.findById(targetDivisionId)
    const updatedTargetDivisionBookComponents = utils.reorderArray(
      targetDivision.bookComponents,
      bookComponentId,
      index,
    )
    await Division.query().patchAndFetchById(targetDivision.id, {
      bookComponents: updatedTargetDivisionBookComponents,
    })

    pubsub.publish(BOOK_COMPONENT_ORDER_UPDATED, {
      bookComponentOrderUpdated: book,
    })
  }
  const div = await Division.query().where('bookId', bookComponent.bookId)
  return div[0].id
}

module.exports = {
  Mutation: {
    updateBookComponentOrder,
  },
  Division: {
    async bookComponents(divisionId, _, ctx) {
      const dbDivision = await Division.findById(divisionId)
      if (dbDivision.bookComponents.length > 0) {
        const bookComponents = await Promise.all(
          map(dbDivision.bookComponents, async bookComponentId => {
            const dbBookComponent = await BookComponent.query()
              .where('id', bookComponentId)
              .andWhere('deleted', false)
            return dbBookComponent[0]
          }),
        )
        return pullAll(bookComponents, [undefined])
      }
      return []
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
