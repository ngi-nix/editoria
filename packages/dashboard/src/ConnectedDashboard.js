import React from 'react'
import { find, get, findIndex, omit, remove, clone } from 'lodash'
import { adopt } from 'react-adopt'

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
} from './queries'

const mapper = {
  getBookCollectionsQuery,
  archiveBookMutation,
  getDashboardRulesQuery,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  archiveBook: args.archiveBookMutation.archiveBook,
  deleteBook: args.deleteBookMutation.deleteBook,
  loading: args.getBookCollectionsQuery.networkStatus === 1,
  onChangeSort: args.getBookCollectionsQuery.refetch,
  refetching:
    args.getBookCollectionsQuery.networkStatus === 4 ||
    args.getBookCollectionsQuery.networkStatus === 2, // possible apollo bug
  renameBook: args.renameBookMutation.renameBook,
  loadingRules: args.getDashboardRulesQuery.loading,
  rules: get(args.getDashboardRulesQuery, 'data.getDashBoardRules'),
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      archiveBook,
      collections,
      createBook,
      rules,
      loadingRules,
      renameBook,
      deleteBook,
      renameBook,
      onChangeSort,
      refetching,
      loading,
    }) => {
      if (loading || loadingRules) return 'Loading...'

      return (
        <Dashboard
          archiveBook={archiveBook}
          collections={collections}
          createBook={createBook}
          deleteBook={deleteBook}
          loading={loading}
          onChangeSort={onChangeSort}
          refetching={refetching}
          renameBook={renameBook}
          rules={rules}
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
      )
    }}
  </Composed>
)

export default Connected
