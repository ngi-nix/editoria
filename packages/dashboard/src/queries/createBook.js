import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { GET_BOOK_COLLECTIONS } from './getBookCollections'

const CREATE_BOOK = gql`
  mutation CreateBook($input: CreateBookInput!) {
    createBook(input: $input) {
      id
      title
    }
  }
`

const refetchQueries = [
  {
    query: GET_BOOK_COLLECTIONS,
  },
]

const createBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CREATE_BOOK} refetchQueries={refetchQueries}>
      {(createBook, createBookResult) =>
        render({ createBook, createBookResult })
      }
    </Mutation>
  )
}

export default createBookMutation
