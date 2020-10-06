import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      id
      collectionId
    }
  }
`

const deleteBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={DELETE_BOOK}>
      {(deleteBook, deleteBookResult) =>
        render({ deleteBook, deleteBookResult })
      }
    </Mutation>
  )
}

export default deleteBookMutation
