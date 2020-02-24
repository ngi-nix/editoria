import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPDATE_BOOK_COMPONENT_UPLOADING = gql`
  mutation UpdateBookComponentUploading($input: UpdateBookComponentInput!) {
    updateUploading(input: $input) {
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

const updateBookComponentUploadingMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_COMPONENT_UPLOADING}>
      {(updateUploading, updateUploadingResult) =>
        render({ updateUploading, updateUploadingResult })
      }
    </Mutation>
  )
}

export default updateBookComponentUploadingMutation
