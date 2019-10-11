/* eslint-disable no-console */

import React from 'react'
import { get, findIndex, map } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import withModal from 'editoria-common/src/withModal'
import BookBuilder from './BookBuilder'
import statefull from './Statefull'
import {
  getBookQuery,
  getBookBuilderRulesQuery,
  createBookComponentMutation,
  deleteBookComponentMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentUploadingMutation,
  unlockBookComponentMutation,
  ingestWordFilesMutation,
  updateBookComponentTypeMutation,
  updateApplicationParametersMutation,
  exportBookMutation,
  orderChangeSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  lockChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
  addTeamMemberSubscription,
  updateBookMetadataMutation,
  bookMetadataSubscription,
  updateRunningHeadersMutation,
  runningHeadersUpdatedSubscription,
  bookRenamedSubscription,
  toggleIncludeInTOCMutation,
  bookComponentIncludeInTOCSubscription,
} from './queries'

const mapper = {
  statefull,
  withModal,
  getBookQuery,
  getBookBuilderRulesQuery,
  lockChangeSubscription,
  orderChangeSubscription,
  bookRenamedSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
  bookComponentIncludeInTOCSubscription,
  runningHeadersUpdatedSubscription,
  addTeamMemberSubscription,
  bookMetadataSubscription,
  ingestWordFilesMutation,
  updateBookMetadataMutation,
  createBookComponentMutation,
  unlockBookComponentMutation,
  deleteBookComponentMutation,
  toggleIncludeInTOCMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentUploadingMutation,
  updateApplicationParametersMutation,
  updateBookComponentTypeMutation,
  updateRunningHeadersMutation,
  exportBookMutation,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  book: get(args.getBookQuery, 'data.getBook'),
  addBookComponent: args.createBookComponentMutation.addBookComponent,
  deleteBookComponent: args.deleteBookComponentMutation.deleteBookComponent,
  toggleIncludeInTOC: args.toggleIncludeInTOCMutation.toggleIncludeInTOC,
  updateRunningHeaders: args.updateRunningHeadersMutation.updateRunningHeaders,
  updateBookComponentPagination:
    args.updateBookComponentPaginationMutation.updateBookComponentPagination,
  updateBookComponentOrder:
    args.updatedBookComponentOrderMutation.updateBookComponentOrder,
  updateBookComponentWorkflowState:
    args.updateBookComponentWorkflowStateMutation
      .updateBookComponentWorkflowState,
  updateBookComponentUploading:
    args.updateBookComponentUploadingMutation.updateUploading,
  updateComponentType: args.updateBookComponentTypeMutation.updateComponentType,
  updateApplicationParameters:
    args.updateApplicationParametersMutation.updateApplicationParameter,
  updateBookMetadata: args.updateBookMetadataMutation.updateMetadata,
  uploadBookComponent: args.ingestWordFilesMutation.ingestWordFiles,
  unlockBookComponent: args.unlockBookComponentMutation.unlockBookComponent,
  ingestWordFiles: args.ingestWordFilesMutation.ingestWordFiles,
  exportBook: args.exportBookMutation.exportBook,
  onDeleteBookComponent: (bookComponentId, componentType, title) => {
    const { deleteBookComponentMutation, withModal } = args
    const { deleteBookComponent } = deleteBookComponentMutation
    const { showModal, hideModal } = withModal
    const onConfirm = () => {
      deleteBookComponent({
        variables: {
          input: {
            id: bookComponentId,
            deleted: true,
          },
        },
      })
      hideModal()
    }
    showModal('deleteBookComponent', {
      onConfirm,
      componentType,
      title,
    })
  },
  onTeamManager: bookId => {
    args.withModal.showModal('bookTeamManager', {
      bookId,
    })
  },
  onError: error => {
    const { withModal } = args
    const { showModal, hideModal } = withModal
    showModal('errorModal', {
      onConfirm: hideModal,
      error,
    })
  },
  onBookSettings: book => {
    const { withModal, updateRunningHeadersMutation } = args
    const { updateRunningHeaders } = updateRunningHeadersMutation
    const { showModal, hideModal } = withModal
    const { divisions } = book
    const bookComponents = []
    for (let i = 0; i < divisions.length; i += 1) {
      for (let j = 0; j < divisions[i].bookComponents.length; j += 1) {
        bookComponents.push(divisions[i].bookComponents[j])
      }
    }

    const onConfirm = bookComponents => {
      updateRunningHeaders({
        variables: {
          input: bookComponents,
          bookId: book.id,
        },
      })
      hideModal()
    }
    showModal('bookSettingsModal', {
      onConfirm,
      bookComponents,
    })
  },
  onWarning: warning => {
    const { withModal } = args
    const { showModal, hideModal } = withModal
    showModal('warningModal', {
      onConfirm: hideModal,
      warning,
    })
  },
  onAdminUnlock: (bookComponentId, componentType, title) => {
    const { unlockBookComponentMutation, withModal } = args
    const { unlockBookComponent } = unlockBookComponentMutation
    const { showModal, hideModal } = withModal
    const onConfirm = () => {
      unlockBookComponent({
        variables: {
          input: {
            id: bookComponentId,
          },
        },
      })
      hideModal()
    }
    showModal('unlockModal', {
      onConfirm,
      componentType,
      title,
    })
  },
  onMetadataAdd: book => {
    const { updateBookMetadataMutation, withModal } = args
    const { updateMetadata } = updateBookMetadataMutation
    const { showModal, hideModal } = withModal
    const onConfirm = values => {
      if (values.edition === '') {
        values.edition = 0
      }
      if (values.copyrightYear === '') {
        values.copyrightYear = 1900
      }
      updateMetadata({
        variables: {
          input: {
            id: book.id,
            ...values,
          },
        },
      })
      hideModal()
    }
    showModal('metadataModal', {
      onConfirm,
      book,
    })
  },
  onWorkflowUpdate: (
    bookComponentId,
    workflowStages,
    nextProgressValues,
    textKey,
  ) => {
    const { updateBookComponentWorkflowStateMutation, withModal } = args
    const {
      updateBookComponentWorkflowState,
    } = updateBookComponentWorkflowStateMutation
    const { showModal, hideModal } = withModal
    const onConfirm = () => {
      const { title, type, value } = nextProgressValues
      const isLast =
        workflowStages.length - 1 ===
        findIndex(workflowStages, { label: title, type })
      const indexOfStage = findIndex(workflowStages, { label: title, type })

      if (value === 1) {
        workflowStages[indexOfStage].value = value
        if (!isLast) {
          workflowStages[indexOfStage + 1].value = 0
        }
      }

      if (value === -1) {
        workflowStages[indexOfStage].value = value
        const next = indexOfStage + 1
        if (type !== 'file_prep') {
          const previous = indexOfStage - 1
          workflowStages[previous].value = 0
        }
        workflowStages[next].value = -1
      }

      if (value === 0) {
        workflowStages[indexOfStage].value = value
        const next = indexOfStage + 1
        for (let i = next; i < workflowStages.length; i += 1) {
          workflowStages[i].value = -1
        }
      }

      const cleanedWorkflowStages = map(workflowStages, item => ({
        label: item.label,
        type: item.type,
        value: item.value,
      }))
      updateBookComponentWorkflowState({
        variables: {
          input: {
            id: bookComponentId,
            workflowStages: cleanedWorkflowStages,
          },
        },
      })
      hideModal()
    }
    showModal('workflowModal', {
      onConfirm,
      textKey,
    })
  },
  loading: args.getBookQuery.networkStatus === 1,
  loadingRules: args.getBookBuilderRulesQuery.networkStatus === 1,
  rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
  refetchingBookBuilderRules:
    args.getBookBuilderRulesQuery.networkStatus === 4 ||
    args.getBookBuilderRulesQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, currentUser, applicationParameter } = props
  const { id: bookId } = match.params

  return (
    <Composed bookId={bookId}>
      {({
        book,
        state,
        setState,
        onTeamManager,
        onBookSettings,
        addBookComponent,
        deleteBookComponent,
        toggleIncludeInTOC,
        updateBookComponentPagination,
        updateBookComponentOrder,
        updateComponentType,
        updateApplicationParameters,
        updateBookComponentWorkflowState,
        onError,
        onWarning,
        onMetadataAdd,
        uploadBookComponent,
        updateBookComponentUploading,
        ingestWordFiles,
        onDeleteBookComponent,
        loading,
        refetching,
        onAdminUnlock,
        loadingRules,
        exportBook,
        rules,
        refetchingBookBuilderRules,
        onWorkflowUpdate,
      }) => (
        <BookBuilder
          addBookComponent={addBookComponent}
          applicationParameter={applicationParameter}
          book={book}
          currentUser={currentUser}
          deleteBookComponent={deleteBookComponent}
          exportBook={exportBook}
          history={history}
          ingestWordFiles={ingestWordFiles}
          loading={loading}
          loadingRules={loadingRules}
          onAdminUnlock={onAdminUnlock}
          onBookSettings={onBookSettings}
          onDeleteBookComponent={onDeleteBookComponent}
          onError={onError}
          onMetadataAdd={onMetadataAdd}
          onTeamManager={onTeamManager}
          onWarning={onWarning}
          onWorkflowUpdate={onWorkflowUpdate}
          refetching={refetching}
          refetchingBookBuilderRules={refetchingBookBuilderRules}
          rules={rules}
          setState={setState}
          state={state}
          toggleIncludeInTOC={toggleIncludeInTOC}
          updateApplicationParameters={updateApplicationParameters}
          updateBookComponentOrder={updateBookComponentOrder}
          updateBookComponentPagination={updateBookComponentPagination}
          updateBookComponentUploading={updateBookComponentUploading}
          updateBookComponentWorkflowState={updateBookComponentWorkflowState}
          updateComponentType={updateComponentType}
          uploadBookComponent={uploadBookComponent}
        />
      )}
    </Composed>
  )
}

export default withRouter(Connected)
