import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const CREATE_BOOK_COMPONENT = gql`
  mutation CreateBookComponent($input: BookComponentInput!) {
    addBookComponent(input: $input) {
      id
      title
      divisionId
      componentTypeOrder
      pagination {
        left
        right
      }
      archived
      workflowStages {
        label
        type
        value
      }
      content
      componentType
      trackChangesEnabled
      uploading
    }
  }
`

const createBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CREATE_BOOK_COMPONENT}>
      {(addBookComponent, addBookComponentResult) =>
        render({ addBookComponent, addBookComponentResult })
      }
    </Mutation>
  )
}

export default createBookComponentMutation
