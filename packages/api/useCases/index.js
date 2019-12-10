const bookComponentUseCase = require('./bookComponent')

module.exports = {
  useCaseAddBookComponent: bookComponentUseCase.addBookComponent,
  useCaseUpdateBookComponentContent: bookComponentUseCase.updateContent,
  useCaseToggleIncludeInTOC: bookComponentUseCase.toggleIncludeInTOC,
  useCaseUpdateComponentType: bookComponentUseCase.updateComponentType,
  useCaseUpdateUploading: bookComponentUseCase.updateUploading,
  useCaseUpdateTrackChanges: bookComponentUseCase.updateTrackChanges,
  useCaseUpdatePagination: bookComponentUseCase.updatePagination,
}
