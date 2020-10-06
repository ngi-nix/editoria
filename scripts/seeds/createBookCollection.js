const logger = require('@pubsweet/logger')

const {
  editoriaDataModel: {
    models: { BookCollection, BookCollectionTranslation },
  },
} = require('../../server/data-model')

const createBookCollection = async () => {
  try {
    logger.info('>>> checking if books collection already exists...')

    const collection = await BookCollection.query()

    if (collection.length !== 0) {
      logger.warn('>>> collection already exists')
      return false
    }

    logger.info('>>> creating a new books collection')
    const createdBookCollection = await BookCollection.query().insert({})
    logger.info(`books collection created with id: ${createdBookCollection.id}`)
    logger.info('>>> creating a new books collection translation')
    const createdBookCollectionTranslation = await BookCollectionTranslation.query().insert(
      {
        collectionId: createdBookCollection.id,
        languageIso: 'en',
        title: 'Books',
      },
    )
    logger.info(
      `books collection translation created with id: ${createdBookCollectionTranslation.id}`,
    )
    return true
  } catch (e) {
    logger.error(e.message)
    throw new Error(e)
  }
}

module.exports = createBookCollection
