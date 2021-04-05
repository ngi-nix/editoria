const { pubsubManager } = require('@coko/server')

const {
  BookComponent,
  ServiceCallbackToken,
} = require('../../data-model/src').models

const { BOOK_COMPONENT_UPLOADING_UPDATED } = require('../bookComponent/consts')

const {
  useCaseUpdateBookComponentContent,
  useCaseUpdateUploading,
} = require('../useCases')

const XSweetCallback = app => {
  app.use('/api/xsweet', async (req, res, next) => {
    try {
      const pubsub = await pubsubManager.getPubsub()
      const { body } = req
      const {
        bookComponentId,
        serviceCredentialId,
        responseToken,
        convertedContent,
        serviceCallbackTokenId,
        error,
      } = body

      if (!convertedContent && error) {
        throw new Error(error)
      }

      const serviceCallbackToken = await ServiceCallbackToken.query().where({
        id: serviceCallbackTokenId,
        responseToken,
        bookComponentId,
        serviceCredentialId,
      })

      if (serviceCallbackToken.length !== 1) {
        throw new Error('unknown service token or conflict')
      }
      const uploading = false
      await useCaseUpdateBookComponentContent(
        bookComponentId,
        convertedContent,
        'en',
      )

      await useCaseUpdateUploading(bookComponentId, uploading)
      const updatedBookComponent = await BookComponent.findById(bookComponentId)
      await ServiceCallbackToken.query().deleteById(serviceCallbackTokenId)

      await pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
        bookComponentUploadingUpdated: updatedBookComponent,
      })

      return res.status(200).json({
        msg: 'ok',
      })
    } catch (error) {
      // the service does not care if something went wrong in editoria
      res.status(200).json({
        msg: 'ok',
      })
      // throw something which will only be displayed in server's logs
      throw new Error(error)
    }
  })
}

module.exports = XSweetCallback
