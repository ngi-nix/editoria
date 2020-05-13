const bookComponent = require('./bookComponent')
const objectStorage = require('./objectStorage')
const file = require('./file')

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
  useCaseSignURL: objectStorage.signURL,
  useCaseUploadFile: objectStorage.uploadFile,
  useCaseDeleteRemoteFiles: objectStorage.deleteFiles,
  useCaseListRemoteFiles: objectStorage.listFiles,
  useCaseGetRemoteFileInfo: objectStorage.getFileInfo,
  useCaseFetchRemoteFileLocally: objectStorage.locallyDownloadFile,
  useCaseCreateFile: file.createFile,
  useCaseUpdateFile: file.updateFile,
  useCaseGetEntityFiles: file.getEntityFiles,
  useCaseGetFiles: file.getFiles,
  useCaseGetFile: file.getFile,
  useCaseDeleteDBFile: file.deleteFile,
  useCaseDeleteDBFiles: file.deleteFiles,
}
