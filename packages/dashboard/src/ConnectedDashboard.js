/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import Dashboard from './Dashboard'
import {
  createBookMutation,
  getBookCollectionsQuery,
  renameBookMutation,
} from './queries'

const mapper = {
  createBookMutation,
  getBookCollectionsQuery,
  renameBookMutation,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  loading: args.getBookCollectionsQuery.loading,
  renameBook: args.renameBookMutation.renameBook,
})

const Composed = adopt(mapper, mapProps)

const Connected = () => {
  const deleteBook = () => {
    console.log('delete book')
  }

  return (
    <Composed>
      {({ createBook, collections, loading, renameBook }) => {
        console.log('coll', collections)
        return (
          <Dashboard
            collections={collections}
            createBook={createBook}
            deleteBook={deleteBook}
            loading={loading}
            renameBook={renameBook}
          />
        )
      }}
    </Composed>
  )
}

export default Connected
