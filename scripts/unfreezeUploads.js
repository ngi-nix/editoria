const logger = require('@pubsweet/logger')
const { editoriaDataModel } = require('../server/data-model')
const map = require('lodash/map')

const { models } = editoriaDataModel

const { BookComponentState } = models

const unfreezeUploading = async () => {
  try {
    const hanged = await BookComponentState.query().where('uploading', true)
    logger.info(`Found ${hanged.length} with hanging uploading`)
    await Promise.all(
      map(hanged, async bookcomponentState => {
        logger.info(`Unfreezing ${bookcomponentState.id}`)
        return BookComponentState.query().patchAndFetchById(
          bookcomponentState.id,
          {
            uploading: false,
          },
        )
      }),
    )
    const after = await BookComponentState.query().where('uploading', true)
    if (after.length === 0) {
      logger.info('Job done')
    } else {
      logger.info(`Remaining ${after}`)
    }
  } catch (e) {
    throw new Error(e)
  }
}
module.exports = unfreezeUploading

unfreezeUploading()
