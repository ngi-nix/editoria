const { logger, useTransaction } = require('@coko/server')
const { ApplicationParameter } = require('../../data-model/src').models

const getApplicationParameters = async (context, area, options = {}) => {
  try {
    logger.info(`>>> fetching application parameters for ${context} - ${area}`)
    const { trx } = options
    if (!trx) {
      if (context && area) {
        const ap = await ApplicationParameter.query()
          .skipUndefined()
          .where({ context, area })
        return ap[0]
      }

      return ApplicationParameter.query()
        .skipUndefined()
        .where({ context, area })
    }

    if (context && area) {
      const ap = await ApplicationParameter.query()
        .skipUndefined()
        .where({ context, area })
      return ap[0]
    }

    return ApplicationParameter.query(trx)
      .skipUndefined()
      .where({ context, area })
  } catch (e) {
    throw new Error(e)
  }
}

const updateApplicationParameters = async (context, area, config) => {
  try {
    const updatedApplicationParameters = await useTransaction(async trx => {
      logger.info(
        `>>> updating application parameters for ${context} - ${area}`,
      )

      const applicationParameter = await ApplicationParameter.query(trx).where({
        context,
        area,
      })

      if (applicationParameter.length !== 1) {
        throw new Error(
          'multiple records for the same application parameters context and area',
        )
      }

      const { id } = applicationParameter[0]

      return ApplicationParameter.query(trx).patchAndFetchById(id, { config })
    })

    return updatedApplicationParameters
  } catch (e) {
    logger.error(e)
    throw new Error(e)
  }
}

module.exports = {
  getApplicationParameters,
  updateApplicationParameters,
}
