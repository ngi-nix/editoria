import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import withModal from '../../common/src/withModal'
import Dashboard from './Dashboard'
import {
  archiveBookMutation,
  createBookMutation,
  getBookCollectionsQuery,
  getDashboardRulesQuery,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
  addTeamMemberSubscription,
} from './queries'

const mapper = {
  withModal,
  getBookCollectionsQuery,
  archiveBookMutation,
  getDashboardRulesQuery,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
  addTeamMemberSubscription,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  archiveBook: args.archiveBookMutation.archiveBook,
  showModal: args.withModal.showModal,
  hideModal: args.withModal.hideModal,
  deleteBook: args.deleteBookMutation.deleteBook,
  loading: args.getBookCollectionsQuery.networkStatus === 1,
  onChangeSort: args.getBookCollectionsQuery.refetch,
  refetching:
    args.getBookCollectionsQuery.networkStatus === 4 ||
    args.getBookCollectionsQuery.networkStatus === 2, // possible apollo bug
  renameBook: args.renameBookMutation.renameBook,
  onAddBook: collectionId => {
    const { createBookMutation, withModal } = args
    const { createBook } = createBookMutation
    const { showModal, hideModal } = withModal
    const onConfirm = title => {
      createBook({
        variables: {
          input: {
            collectionId,
            title,
          },
        },
      })
      hideModal()
    }
    showModal('addBook', {
      onConfirm,
      hideModal,
    })
  },
  onDeleteBook: (bookId, bookTitle) => {
    const { deleteBookMutation, withModal } = args
    const { deleteBook } = deleteBookMutation
    const { showModal, hideModal } = withModal
    const onConfirm = () => {
      deleteBook({
        variables: {
          id: bookId,
        },
      })
      hideModal()
    }
    showModal('deleteBook', {
      onConfirm,
      bookTitle,
    })
  },
  onArchiveBook: (bookId, bookTitle, archived) => {
    const { archiveBookMutation, withModal } = args
    const { archiveBook } = archiveBookMutation
    const { showModal, hideModal } = withModal
    const onConfirm = () => {
      archiveBook({
        variables: {
          id: bookId,
          archive: !archived,
        },
      })
      hideModal()
    }
    showModal('archiveBook', {
      onConfirm,
      bookTitle,
      archived,
    })
  },
  loadingRules: args.getDashboardRulesQuery.networkStatus === 1,
  refetchingRules:
    args.getDashboardRulesQuery.networkStatus === 4 ||
    args.getDashboardRulesQuery.networkStatus === 2, // possible apollo bug
  rules: get(args.getDashboardRulesQuery, 'data.getDashBoardRules'),
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      archiveBook,
      collections,
      loadingRules,
      refetchingRules,
      renameBook,
      deleteBook,
      onChangeSort,
      refetching,
      loading,
      onAddBook,
      onDeleteBook,
      onArchiveBook,
      rules,
    }) => (
      <Dashboard
        archiveBook={archiveBook}
        collections={collections}
        deleteBook={deleteBook}
        loading={loading}
        loadingRules={loadingRules}
        onAddBook={onAddBook}
        onArchiveBook={onArchiveBook}
        onChangeSort={onChangeSort}
        onDeleteBook={onDeleteBook}
        refetching={refetching}
        refetchingRules={refetchingRules}
        renameBook={renameBook}
        rules={rules}
      />
    )}
  </Composed>
)

export default Connected
