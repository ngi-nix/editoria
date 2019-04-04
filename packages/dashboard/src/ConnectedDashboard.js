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
    onAddBook: (collectionId) => {
      const {createBookMutation, withModal} = args
      const {createBook} = createBookMutation
      const {showModal, hideModal} = withModal
      const onConfirm = (title) => {
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
      args.withModal.showModal('deleteBook', {
        deleteBook: args.deleteBookMutation.deleteBook,
        bookId,
        bookTitle,
      })
    },
    onArchiveBook: (bookId, bookTitle, archived) => {
      args.withModal.showModal('archiveBook', {
        archiveBook: args.archiveBookMutation.archiveBook,
        bookId,
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
