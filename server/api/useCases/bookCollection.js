const { logger, useTransaction } = require('@coko/server')
const {
  BookCollectionTranslation,
  BookCollection,
} = require('../../data-model/src').models

const getBookCollection = async id => {
  try {
    logger.info(`>>> fetching book collection with id ${id}`)
    return BookCollection.query().where({ id, deleted: false })
  } catch (e) {
    throw new Error(e)
  }
}

const getBookCollections = async () => {
  try {
    logger.info(`>>> fetching all book collections`)
    return BookCollection.query().where({ deleted: false })
  } catch (e) {
    throw new Error(e)
  }
}

const createBookCollection = async (title, languageIso = 'en') => {
  try {
    return useTransaction(async trx => {
      logger.info('>>> creating a new books collection')

      const createdBookCollection = await BookCollection.query(trx).insert({})

      logger.info(
        `>>> books collection created with id: ${createdBookCollection.id}`,
      )

      logger.info('>>> creating a new books collection translation')

      const createdBookCollectionTranslation = await BookCollectionTranslation.query(
        trx,
      ).insert({
        collectionId: createdBookCollection.id,
        languageIso,
        title,
      })

      logger.info(
        `>>> books collection translation created with id: ${createdBookCollectionTranslation.id}`,
      )

      return createdBookCollection
    })
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  getBookCollection,
  getBookCollections,
  createBookCollection,
}
