const { logger, useTransaction } = require('@coko/server')

const { Division } = require('../../data-model/src').models

const createDivision = async (divisionData, options = {}) => {
  try {
    const { trx } = options
    logger.info(
      `>>> creating division ${divisionData.label} for the book with id ${divisionData.bookId}`,
    )

    return useTransaction(async tr => Division.query(tr).insert(divisionData), {
      trx,
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  createDivision,
}
