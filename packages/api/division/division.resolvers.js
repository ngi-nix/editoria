const updateBookComponentOrder = async (
  _,
  { sourceDivisionId, targetDivisionId, bookComponentId, index },
  ctx,
) => {
  // TODO: pending implementation
}

module.exports = {
  Mutation: {
    updateBookComponentOrder,
  },
  Division: {
    async bookComponents(division, _, ctx) {
      // TODO: pending implementation
    },
  },
}
