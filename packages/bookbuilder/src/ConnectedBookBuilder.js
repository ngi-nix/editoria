/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import BookBuilder from './BookBuilder'
import { getBookQuery } from './queries'

const mapper = {
  getBookQuery,
}

const mapProps = args => ({
  book: get(args.getBookQuery, 'data.getBook'),
  loading: args.getBookQuery.loading,
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({ book, loading }) => {
      if (loading) return 'Loading...'
      return <BookBuilder book={book} loading={loading} />
    }}
  </Composed>
)

export default Connected
