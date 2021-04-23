const { pubsubManager, logger } = require('@coko/server')
const express = require('express')
const {
  BookComponent,
  Lock,
  ServiceCallbackToken,
} = require('../../data-model/src').models

const { useCaseUnlockBookComponent } = require('../useCases')

const {
  BOOK_COMPONENT_UPLOADING_UPDATED,
  BOOK_COMPONENT_LOCK_UPDATED,
} = require('../bookComponent/consts')

const unlockHandler = async (userId, bookComponentId) => {
  const bookComponentLock = await Lock.query().where({
    foreignId: bookComponentId,
    deleted: false,
  })

  if (bookComponentLock.length === 0) {
    logger.info('nothing to unlock')
    return false
  }
  const { userId: userLock } = bookComponentLock[0]
  if (userId !== userLock) {
    logger.info('lock taken by another user')
  } else {
    const pubsub = await pubsubManager.getPubsub()
    await useCaseUnlockBookComponent(bookComponentId)
    const updatedBookComponent = await BookComponent.findById(bookComponentId)
    await pubsub.publish(BOOK_COMPONENT_LOCK_UPDATED, {
      bookComponentLockUpdated: updatedBookComponent,
    })
  }
  return true
}
const {
  useCaseUpdateBookComponentContent,
  useCaseUpdateUploading,
  useCaseDeleteBookComponent,
} = require('../useCases')

const Controllers = app => {
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
        const updatedBookComponent = await BookComponent.findById(
          bookComponentId,
        )
        await useCaseDeleteBookComponent(updatedBookComponent)
        await pubsub.publish(BOOK_COMPONENT_UPLOADING_UPDATED, {
          bookComponentUploadingUpdated: updatedBookComponent,
        })
        throw new Error('error in xsweet conversion')
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
  app.use('/api/unlockBeacon', express.text(), async (req, res, next) => {
    const { body } = req
    const data = body && JSON.parse(req.body)
    const { uid: userId, bbid: bookComponentId } = data
    setTimeout(() => unlockHandler(userId, bookComponentId), 1000)
    return res.status(200).end()
  })
}

module.exports = Controllers
