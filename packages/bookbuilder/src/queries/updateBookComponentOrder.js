import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_BOOK_COMPONENT_ORDER = gql`
  mutation UpdateBookComponentOrder(
    $targetDivisionId: ID!
    $bookComponentId: ID!
    $index: Int!
  ) {
    updateBookComponentOrder(
      targetDivisionId: $targetDivisionId
      bookComponentId: $bookComponentId
      index: $index
    ) {
      id
    }
  }
`

const updatedBookComponentOrderMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_COMPONENT_ORDER}>
      {(updateBookComponentOrder, updateBookComponentOrderResult) =>
        render({ updateBookComponentOrder, updateBookComponentOrderResult })
      }
    </Mutation>
  )
}

export default updatedBookComponentOrderMutation
