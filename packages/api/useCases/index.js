const bookComponentUseCase = require('./bookComponent')

module.exports = {
  useCaseAddBookComponent: bookComponentUseCase.addBookComponent,
  useCaseUpdateBookComponentContent: bookComponentUseCase.updateContent,
  useCaseToggleIncludeInTOC: bookComponentUseCase.toggleIncludeInTOC,
  useCaseUpdateComponentType: bookComponentUseCase.updateComponentType,
  useCaseUpdateUploading: bookComponentUseCase.updateUploading,
  useCaseUpdateTrackChanges: bookComponentUseCase.updateTrackChanges,
  useCaseUpdatePagination: bookComponentUseCase.updatePagination,
  useCaseLockBookComponent: bookComponentUseCase.lockBookComponent,
  useCaseUnlockBookComponent: bookComponentUseCase.unlockBookComponent,
  useCaseUpdateWorkflowState: bookComponentUseCase.updateWorkflowState,
  useCaseDeleteBookComponent: bookComponentUseCase.deleteBookComponent,
  useCaseRenameBookComponent: bookComponentUseCase.renameBookComponent,
}
