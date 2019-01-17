import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const DELETE_BOOK_COMPONENT = gql`
  mutation DeleteBookComponent($input: UpdateBookComponentInput!) {
    deleteBookComponent(input: $input) {
      id
    }
  }
`

const deleteBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={DELETE_BOOK_COMPONENT}>
      {(deleteBookComponent, deleteBookComponentResult) =>
        render({ deleteBookComponent, deleteBookComponentResult })
      }
    </Mutation>
  )
}

export default deleteBookComponentMutation
