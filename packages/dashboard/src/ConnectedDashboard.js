import React from 'react'
import { find, get, findIndex, omit, remove, clone } from 'lodash'
import { adopt } from 'react-adopt'

import Dashboard from './Dashboard'
import {
  createBookMutation,
  getBookCollectionsQuery,
  renameBookMutation,
  deleteBookMutation,
  bookSubscriptions,
  // BOOK_CREATED_SUBSCRIPTION,
  // BOOK_RENAMED_SUBSCRIPTION,
  // BOOK_DELETED_SUBSCRIPTION,
} from './queries'

const mapper = {
  getBookCollectionsQuery,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
  // bookSubscriptions,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  // data: args.bookSubscriptions.data,
  // subLoading: args.bookSubscriptions.loading,
  deleteBook: args.deleteBookMutation.deleteBook,
  loading: args.getBookCollectionsQuery.loading,
  onChangeSort: args.getBookCollectionsQuery.refetch,
  refetching:
    args.getBookCollectionsQuery.networkStatus === 4 ||
    args.getBookCollectionsQuery.networkStatus === 2, // possible apollo bug
  renameBook: args.renameBookMutation.renameBook,
  // subscribeToMore: get(args.getBookCollectionsQuery, 'subscribeToMore'),
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      collections,
      createBook,
      deleteBook,
      renameBook,
      onChangeSort,
      refetching,
      loading,
    }) => {
      console.log('col', collections)
      {/* console.log('data', data) */}
      
        if (collections === undefined) {
        return 'loading'
      }
      
      return (
        <Dashboard
          collections={collections}
          createBook={createBook}
          deleteBook={deleteBook}
          loading={loading}
          onChangeSort={onChangeSort}
          refetching={refetching}
          renameBook={renameBook}
          // subscribeToBookDeleted={() =>
          //   subscribeToMore({
          //     document: BOOK_DELETED_SUBSCRIPTION,
          //     updateQuery: (prev, { subscriptionData }) => {
          //       const { bookDeleted } = subscriptionData.data
          //       const found = find(prev.getBookCollections, [
          //         'id',
          //         bookDeleted.collectionId,
          //       ])
          //       if (found) {
          //         const temp = Object.assign({}, found)
          //         remove(temp.books, book => book.id === bookDeleted.id)
          //         return Object.assign({}, prev, temp)
          //       }
          //       return prev
          //     },
          //   })
          // }
          // subscribeToBookRenamed={() =>
          //   subscribeToMore({
          //     document: BOOK_RENAMED_SUBSCRIPTION,
          //     updateQuery: (prev, { subscriptionData }) => {
          //       const { bookRenamed } = subscriptionData.data
          //       const foundCollection = find(prev.getBookCollections, [
          //         'id',
          //         bookRenamed.collectionId,
          //       ])
          //       if (foundCollection) {
          //         const foundBook = find(foundCollection.books, [
          //           'id',
          //           bookRenamed.id,
          //         ])
          //         if (foundBook) {
          //           const renamed = Object.assign(
          //             {},
          //             foundBook,
          //             omit(bookRenamed, ['collectionId']),
          //           )
          //           const index = findIndex(foundCollection.books, [
          //             'id',
          //             bookRenamed.id,
          //           ])
          //           const copy = Object.assign({}, foundCollection)
          //           copy.books[index] = renamed
          //           return Object.assign({}, prev, copy)
          //         }
          //         return prev
          //       }
          //       return prev
          //     },
          //   })
          // }
          // subscribeToNewBooks={() =>
          //   subscribeToMore({
          //     document: BOOK_CREATED_SUBSCRIPTION,
          //     updateQuery: (prev, { subscriptionData }) => {
          //       const { bookCreated } = subscriptionData.data
          //       const found = find(prev.getBookCollections, [
          //         'id',
          //         bookCreated.collectionId,
          //       ])
          //       const index = findIndex(prev.getBookCollections, {
          //         id: bookCreated.collectionId,
          //       })
          //       console.log('inhere')
          //       console.log('prev', prev)
          //       if (found) {
          //         const copy = clone(prev)
          //         copy.getBookCollections[index].books.push(
          //           omit(bookCreated, ['collectionId']),
          //         )

          //         // found.books.push(omit(bookCreated, ['collectionId']))
          //         console.log('found', found)
          //         const test = Object.assign({}, prev, copy)
          //         console.log('te', test)
          //         return test
          //       }
          //       console.log('pre', prev)
          //       return prev
          //     },
          //   })
          // }
        />
      )
    }}
  </Composed>
)

export default Connected
