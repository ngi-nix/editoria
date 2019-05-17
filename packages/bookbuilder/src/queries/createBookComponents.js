import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const CREATE_BOOK_COMPONENTS = gql`
  mutation CreateBookComponents($input: [BookComponentInput]!) {
    addBookComponents(input: $input) {
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

const createBookComponentsMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CREATE_BOOK_COMPONENTS}>
      {(addBookComponents, addBookComponentsResult) =>
        render({ addBookComponents, addBookComponentsResult })
      }
    </Mutation>
  )
}

export default createBookComponentsMutation
