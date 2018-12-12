const map = require('lodash/flatMapDepth')
const findIndex = require('lodash/findIndex')
const utils = require('../helpers/utils')
const { BookComponent } = require('editoria-data-model/src').models

const updateBookComponentOrder = async (
  _,
  { targetDivisionId, bookComponentId, index },
  ctx,
) => {
  const bookComponent = await ctx.model.bookComponent
    .findById({ id: bookComponentId })
    .exec()
  const sourceDivision = await ctx.model.division
    .findById({ id: bookComponent.divisionId })
    .exec()
  const found = findIndex(sourceDivision.bookComponents, bookComponentId)

  if (sourceDivision.id === targetDivisionId) {
    await ctx.model.division
      .update({
        id: sourceDivision.id,
        bookComponents: utils.reorderArray(
          sourceDivision.bookComponents,
          bookComponentId,
          index,
          found,
        ),
      })
      .exec()
  } else {
    await ctx.model.division
      .update({
        id: sourceDivision.id,
        bookComponents: sourceDivision.bookComponents.splice(
          found,
          0,
          bookComponentId,
        ),
      })
      .exec()
    const targetDivision = await ctx.model.division
      .findById({ id: targetDivisionId })
      .exec()
    await ctx.model.division
      .update({
        id: targetDivisionId,
        bookComponents: utils.reorderArray(
          targetDivision.bookComponents,
          bookComponentId,
          index,
        ),
      })
      .exec()
  }
  return ctx.model.division
    .findByBookId({ bookId: bookComponent.bookId })
    .exec()
}

module.exports = {
  Mutation: {
    updateBookComponentOrder,
  },
  Division: {
    async bookComponents(division, _, ctx) {
      const bookComponents = await Promise.all(
        map(division.bookComponents, async bookComponent =>
          BookComponent.query().where('id', bookComponent.id),
        ),
      )
      return bookComponents
    },
  },
}
