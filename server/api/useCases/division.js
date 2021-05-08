const { logger } = require('@coko/server')

const { Division } = require('../../data-model/src').models

const createDivision = async (divisionData, options = {}) => {
  const { trx } = options
  logger.info(
    `>>> creating division ${divisionData.label} for the book with id ${divisionData.bookId}`,
  )
  if (!trx) {
    return Division.query().insert(divisionData)
  }
  return Division.query(trx).insert(divisionData)
}

module.exports = {
  createDivision,
}
