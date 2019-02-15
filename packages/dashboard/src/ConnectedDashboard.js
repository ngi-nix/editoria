import React from 'react'
import { find, get, findIndex, omit, remove } from 'lodash'
import { adopt } from 'react-adopt'

import Dashboard from './Dashboard'
import {
  createBookMutation,
  getBookCollectionsQuery,
  renameBookMutation,
  deleteBookMutation,
  BOOK_CREATED_SUBSCRIPTION,
  BOOK_RENAMED_SUBSCRIPTION,
  BOOK_DELETED_SUBSCRIPTION,
} from './queries'

const mapper = {
  getBookCollectionsQuery,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  deleteBook: args.deleteBookMutation.deleteBook,
  loading: args.getBookCollectionsQuery.networkStatus === 1,
  onChangeSort: args.getBookCollectionsQuery.refetch,
  refetching:
    args.getBookCollectionsQuery.networkStatus === 4 ||
    args.getBookCollectionsQuery.networkStatus === 2, // possible apollo bug
  renameBook: args.renameBookMutation.renameBook,
  subscribeToMore: get(args.getBookCollectionsQuery, 'subscribeToMore'),
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      collections,
      createBook,
      deleteBook,
      loading,
      onChangeSort,
      refetching,
      renameBook,
      subscribeToMore,
    }) => (
      <Dashboard
        collections={collections}
        createBook={createBook}
        deleteBook={deleteBook}
        loading={loading}
        onChangeSort={onChangeSort}
        refetching={refetching}
        renameBook={renameBook}
        subscribeToBookDeleted={() =>
          subscribeToMore({
            document: BOOK_DELETED_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              const { bookDeleted } = subscriptionData.data
              const found = find(prev.getBookCollections, [
                'id',
                bookDeleted.collectionId,
              ])
              if (found) {
                const temp = Object.assign({}, found)
                remove(temp.books, book => book.id === bookDeleted.id)
                return Object.assign({}, prev, temp)
              }
              return prev
            },
          })
        }
        subscribeToBookRenamed={() =>
          subscribeToMore({
            document: BOOK_RENAMED_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              const { bookRenamed } = subscriptionData.data
              const foundCollection = find(prev.getBookCollections, [
                'id',
                bookRenamed.collectionId,
              ])
              if (foundCollection) {
                const foundBook = find(foundCollection.books, [
                  'id',
                  bookRenamed.id,
                ])
                if (foundBook) {
                  const renamed = Object.assign(
                    {},
                    foundBook,
                    omit(bookRenamed, ['collectionId']),
                  )
                  const index = findIndex(foundCollection.books, [
                    'id',
                    bookRenamed.id,
                  ])
                  const copy = Object.assign({}, foundCollection)
                  copy.books[index] = renamed
                  return Object.assign({}, prev, copy)
                }
                return prev
              }
              return prev
            },
          })
        }
        subscribeToNewBooks={() =>
          subscribeToMore({
            document: BOOK_CREATED_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              const { bookCreated } = subscriptionData.data
              const found = find(prev.getBookCollections, [
                'id',
                bookCreated.collectionId,
              ])
              if (found) {
                found.books.push(omit(bookCreated, ['collectionId']))
                return Object.assign({}, prev, found)
              }
              return prev
            },
          })
        }
      />
    )}
  </Composed>
)

export default Connected
