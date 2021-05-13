const applicationParameters = require('./applicationParameters')
const bookComponent = require('./bookComponent')
const book = require('./book')
const team = require('./team')
const bookCollection = require('./bookCollection')
const objectStorage = require('./objectStorage')
const file = require('./file')
const services = require('./services')
const division = require('./division')

module.exports = {
  useCaseGetApplicationParameters:
    applicationParameters.getApplicationParameters,
  useCaseUpdateApplicationParameters:
    applicationParameters.updateApplicationParameters,
  useCaseAddBookComponent: bookComponent.addBookComponent,
  useCaseCreateDivision: division.createDivision,
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
  useCaseGetBookCollection: bookCollection.getBookCollection,
  useCaseGetBookCollections: bookCollection.getBookCollections,
  useCaseCreateBookCollection: bookCollection.createBookCollection,
  useCaseSignURL: objectStorage.signURL,
  useCaseUploadFile: objectStorage.uploadFile,
  useCaseDeleteRemoteFiles: objectStorage.deleteFiles,
  useCaseListRemoteFiles: objectStorage.listFiles,
  useCaseGetRemoteFileInfo: objectStorage.getFileInfo,
  useCaseFetchRemoteFileLocally: objectStorage.locallyDownloadFile,
  useCaseCreateFile: file.createFile,
  useCaseUpdateFile: file.updateFile,
  useCaseUpdateFiles: file.updateFiles,
  useCaseGetEntityFiles: file.getEntityFiles,
  useCaseGetFiles: file.getFiles,
  useCaseGetSpecificFiles: file.getSpecificFiles,
  useCaseGetFile: file.getFile,
  useCaseDeleteDBFile: file.deleteFile,
  useCaseDeleteDBFiles: file.deleteFiles,
  useCaseGetFileURL: file.getFileURL,
  useCaseGetContentFiles: file.getContentFiles,
  useCaseIsFileInUse: file.isFileInUse,
  useCaseEPUBChecker: services.epubcheckerHandler,
  useCaseICML: services.icmlHandler,
  useCaseXSweet: services.xsweetHandler,
  useCasePDF: services.pdfHandler,
  useCaseGetPreviewerLink: services.pagedPreviewerLinkHandler,
  useCaseGetBook: book.getBook,
  useCaseGetBooks: book.getBooks,
  useCaseArchiveBook: book.archiveBook,
  useCaseCreateBook: book.createBook,
  useCaseRenameBook: book.renameBook,
  useCaseDeleteBook: book.deleteBook,
  useCaseExportBook: book.exportBook,
  useCaseUpdateMetadata: book.updateMetadata,
  useCaseUpdateRunningHeader: book.updateRunningHeaders,
  useCaseCreateTeam: team.createTeam,
  useCaseGetEntityTeams: team.getEntityTeams,
  useCaseGetEntityTeam: team.getEntityTeam,
  useCaseDeleteTeam: team.deleteTeam,
  useCaseUpdateTeamMembers: team.updateTeamMembers,
  useCaseGetGlobalTeams: team.getGlobalTeams,
}
