const bookComponent = require('./bookComponent')
const fileHosting = require('./fileHosting')

module.exports = {
  useCaseAddBookComponent: bookComponent.addBookComponent,
  useCaseUpdateBookComponentContent: bookComponent.updateContent,
  useCaseToggleIncludeInTOC: bookComponent.toggleIncludeInTOC,
  useCaseUpdateComponentType: bookComponent.updateComponentType,
  useCaseUpdateUploading: bookComponent.updateUploading,
  useCaseUpdateTrackChanges: bookComponent.updateTrackChanges,
  useCaseUpdatePagination: bookComponent.updatePagination,
  useCaseLockBookComponent: bookComponent.lockBookComponent,
  useCaseUnlockBookComponent: bookComponent.unlockBookComponent,
  useCaseUpdateWorkflowState: bookComponent.updateWorkflowState,
  useCaseDeleteBookComponent: bookComponent.deleteBookComponent,
  useCaseRenameBookComponent: bookComponent.renameBookComponent,
  useCaseSignS3: fileHosting.signS3,
  useCaseUploadFile: fileHosting.uploadFile,
  useCaseDeleteFiles: fileHosting.deleteFiles,
  useCaseListRemoteFiles: fileHosting.listFiles,
  useCaseGetRemoteFileInfo: fileHosting.getFileInfo,
  useCaseFetchRemoteFileLocally: fileHosting.locallyDownloadFile,
}
