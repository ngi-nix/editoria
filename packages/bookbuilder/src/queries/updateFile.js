import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPDATE_FILES = gql`
  mutation UpdateFile($input: UpdateFileInput!) {
    updateFile(input: $input) {
      id
      name
      mimetype
      source
    }
  }
`

const updateFileMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_FILES}>
      {(updateFile, updateFileResult) =>
        render({ updateFile, updateFileResult })
      }
    </Mutation>
  )
}

export default updateFileMutation
