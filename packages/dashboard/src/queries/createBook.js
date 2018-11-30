import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { GET_BOOK_COLLECTIONS } from './getBookCollections'

const ADD_BOOK = gql`
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

const addBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={ADD_BOOK} refetchQueries={refetchQueries}>
      {(addBook, addBookResult) => render({ addBook, addBookResult })}
    </Mutation>
  )
}

export default addBookMutation
