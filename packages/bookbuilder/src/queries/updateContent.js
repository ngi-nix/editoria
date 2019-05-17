import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_BOOK_COMPONENT_CONTENT = gql`
  mutation UpdateBookComponentContent($input: UpdateBookComponentInput!) {
    updateContent(input: $input) {
      id
      title
      # division
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

const updateBookComponentContentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_COMPONENT_CONTENT}>
      {(updateContent, updateContentResult) =>
        render({ updateContent, updateContentResult })
      }
    </Mutation>
  )
}

export default updateBookComponentContentMutation
