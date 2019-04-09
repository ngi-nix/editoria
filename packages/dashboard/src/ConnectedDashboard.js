import React, { Fragment } from 'react'
import { find, get, findIndex, omit, remove, clone } from 'lodash'
import { adopt } from 'react-adopt'

import withModal from 'editoria-common/src/withModal'
import Dashboard from './Dashboard'
import {
  archiveBookMutation,
  createBookMutation,
  getBookCollectionsQuery,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
} from './queries'

const mapper = {
  withModal,
  getBookCollectionsQuery,
  archiveBookMutation,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
}

const mapProps = args => {
  return {
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
  }
}

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      archiveBook,
      collections,
      deleteBook,
      renameBook,
      onChangeSort,
      refetching,
      loading,
      onAddBook,
      onDeleteBook,
      onArchiveBook,
      ...rest
    }) => {
      return (
        <Dashboard
          archiveBook={archiveBook}
          collections={collections}
          onAddBook={onAddBook}
          onDeleteBook={onDeleteBook}
          onArchiveBook={onArchiveBook}
          deleteBook={deleteBook}
          loading={loading}
          onChangeSort={onChangeSort}
          refetching={refetching}
          renameBook={renameBook}
        />
      )
    }}
  </Composed>
)

export default Connected
