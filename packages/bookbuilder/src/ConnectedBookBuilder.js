/* eslint-disable no-console */

import React from 'react'
import { get, find, findIndex, difference, forEach, map } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import BookBuilder from './BookBuilder'
import withModal from 'editoria-common/src/withModal'
import {
  getBookQuery,
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
  updateBookComponentTypeMutation,
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
} from './queries'

const mapper = {
  withModal,
  getBookQuery,
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
  updateBookComponentTypeMutation,
  exportBookMutation,
  lockChangeSubscription,
  orderChangeSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
}

const mapProps = args => ({
  book: get(args.getBookQuery, 'data.getBook'),
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
    showModal('warningModal', {
      onConfirm: hideModal,
      error,
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

  loading: args.getBookQuery.networkStatus === 1,
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history } = props
  const { id: bookId } = match.params

  return (
    <Composed bookId={bookId}>
      {({
        book,
        onTeamManager,
        addBookComponent,
        addBookComponents,
        deleteBookComponent,
        updateBookComponentPagination,
        updateBookComponentOrder,
        updateComponentType,
        updateBookComponentWorkflowState,
        onError,
        updateBookComponentContent,
        updateBookComponentUploading,
        ingestWordFiles,
        onDeleteBookComponent,
        loading,
        refetching,
        onAdminUnlock,
        exportBook,
      }) => {
        return (
          <BookBuilder
            addBookComponent={addBookComponent}
            addBookComponents={addBookComponents}
            onTeamManager={onTeamManager}
            onError={onError}
            onAdminUnlock={onAdminUnlock}
            refetching={refetching}
            book={book}
            history={history}
            exportBook={exportBook}
            deleteBookComponent={deleteBookComponent}
            onDeleteBookComponent={onDeleteBookComponent}
            ingestWordFiles={ingestWordFiles}
            loading={loading}
            updateBookComponentContent={updateBookComponentContent}
            updateComponentType={updateComponentType}
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
