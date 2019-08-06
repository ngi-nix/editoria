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
  getDocxToHTMLJobQuery,
  createBookComponentMutation,
  createBookComponentsMutation,
  deleteBookComponentMutation,
  ingestWordFilesMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentContentMutation,
  updateBookComponentUploadingMutation,
  unlockBookComponentMutation,
  uploadBookComponentMutation,
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
  bookRenamedSubscription,
  docxToHTMLJobSubscription,
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
  addTeamMemberSubscription,
  bookMetadataSubscription,
  uploadBookComponentMutation,
  docxToHTMLJobSubscription,
  getDocxToHTMLJobQuery,
  updateBookMetadataMutation,
  createBookComponentMutation,
  unlockBookComponentMutation,
  createBookComponentsMutation,
  deleteBookComponentMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentContentMutation,
  updateBookComponentUploadingMutation,
  ingestWordFilesMutation,
  updateApplicationParametersMutation,
  updateBookComponentTypeMutation,
  exportBookMutation,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  book: get(args.getBookQuery, 'data.getBook'),
  docxHtml: get(args.getDocxToHTMLJobQuery, 'data.docxToHTMLJob'),
  addBookComponent: args.createBookComponentMutation.addBookComponent,
  addBookComponents: args.createBookComponentsMutation.addBookComponents,
  deleteBookComponent: args.deleteBookComponentMutation.deleteBookComponent,
  updateBookComponentPagination:
    args.updateBookComponentPaginationMutation.updateBookComponentPagination,
  updateBookComponentOrder:
    args.updatedBookComponentOrderMutation.updateBookComponentOrder,
  updateBookComponentWorkflowState:
    args.updateBookComponentWorkflowStateMutation
      .updateBookComponentWorkflowState,
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentUploading:
    args.updateBookComponentUploadingMutation.updateUploading,
  updateComponentType: args.updateBookComponentTypeMutation.updateComponentType,
  updateApplicationParameters:
    args.updateApplicationParametersMutation.updateApplicationParameter,
  updateBookMetadata: args.updateBookMetadataMutation.updateMetadata,
  uploadBookComponent: args.uploadBookComponentMutation.uploadBookComponent,
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
  loadingGetDocx: args.getDocxToHTMLJobQuery
    ? args.getDocxToHTMLJobQuery.networkStatus === 1
    : true,
  loadingRules: args.getBookBuilderRulesQuery.networkStatus === 1,
  rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
  refetchingGetDocx: args.getDocxToHTMLJobQuery
    ? args.getDocxToHTMLJobQuery.networkStatus === 4 ||
      args.getDocxToHTMLJobQuery.networkStatus === 2
    : true, // possible apollo bug
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
        docxToHTMLJob,
        state,
        setState,
        onTeamManager,
        addBookComponent,
        addBookComponents,
        deleteBookComponent,
        updateBookComponentPagination,
        updateBookComponentOrder,
        updateComponentType,
        updateApplicationParameters,
        updateBookComponentWorkflowState,
        onError,
        onWarning,
        onMetadataAdd,
        uploadBookComponent,
        updateBookComponentContent,
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
      }) => {
        console.log(docxToHTMLJob, 'Connected BookBuilder')
        return (
          <BookBuilder
            addBookComponent={addBookComponent}
            addBookComponents={addBookComponents}
            applicationParameter={applicationParameter}
            state={state}
            setState={setState}
            onTeamManager={onTeamManager}
            onError={onError}
            onWarning={onWarning}
            currentUser={currentUser}
            onAdminUnlock={onAdminUnlock}
            onMetadataAdd={onMetadataAdd}
            refetching={refetching}
            refetchingBookBuilderRules={refetchingBookBuilderRules}
            onWorkflowUpdate={onWorkflowUpdate}
            book={book}
            history={history}
            exportBook={exportBook}
            deleteBookComponent={deleteBookComponent}
            onDeleteBookComponent={onDeleteBookComponent}
            ingestWordFiles={ingestWordFiles}
            loading={loading}
            loadingRules={loadingRules}
            rules={rules}
            updateBookComponentContent={updateBookComponentContent}
            uploadBookComponent={uploadBookComponent}
            updateComponentType={updateComponentType}
            updateApplicationParameters={updateApplicationParameters}
            updateBookComponentOrder={updateBookComponentOrder}
            updateBookComponentPagination={updateBookComponentPagination}
            updateBookComponentUploading={updateBookComponentUploading}
            updateBookComponentWorkflowState={updateBookComponentWorkflowState}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
