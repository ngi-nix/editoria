import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { GET_BOOK_COLLECTIONS } from './getBookCollections'

const RENAME_BOOK = gql`
  mutation RenameBook($id: ID!, $title: String!) {
    renameBook(id: $id, title: $title) {
      id
    }
  }
`

const refetchQueries = [
  {
    query: GET_BOOK_COLLECTIONS,
  },
]

const renameBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={RENAME_BOOK} refetchQueries={refetchQueries}>
      {(renameBook, renameBookResult) =>
        render({ renameBook, renameBookResult })
      }
    </Mutation>
  )
}

export default renameBookMutation
