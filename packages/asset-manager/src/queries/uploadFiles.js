import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPLOAD_FILES = gql`
  mutation UploadFiles($files: [Upload]!, $entityType: String, $entityId: ID) {
    uploadFiles(files: $files, entityType: $entityType, entityId: $entityId) {
      id
    }
  }
`

const uploadFilesMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPLOAD_FILES}>
      {(uploadFiles, uploadFilesResult) =>
        render({
          uploadFiles,
          uploadFilesResult,
        })
      }
    </Mutation>
  )
}

export { UPLOAD_FILES }
export default uploadFilesMutation
