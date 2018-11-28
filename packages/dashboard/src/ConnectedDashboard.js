/* eslint-disable */

import React from 'react'

import { adopt } from 'react-adopt'

import Dashboard from './Dashboard'

import { getBookCollections } from './queries'

const mapper = {
  getBookCollections,
}

const mapProps = args => {
  return {
    collections: args.getBookCollections.data.collections,
    loading: args.getBookCollections.loading,
  }
}

// const Composed = adopt(mapper, mapProps)

const Connected = () => {
  // const collections = [
  //   {
  //     title: 'Books',
  //     books: [],
  //   },
  // ]

  const addBook = () => {
    console.log('add book')
  }

  const renameBook = () => {
    console.log('rename book')
  }

  const deleteBook = () => {
    console.log('delete book')
  }

  return (
    <Composed>
      {({ collections, loading }) => (
        <Dashboard
          addBook={addBook}
          collections={collections}
          deleteBook={deleteBook}
          loading={loading}
          renameBook={renameBook}
        />
      )}
    </Composed>
  )
}

export default Connected
