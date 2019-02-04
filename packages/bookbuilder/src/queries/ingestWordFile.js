import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const INGEST_WORD_FILES = gql`
  mutation IngestWordFiles($files: [Upload]!) {
    ingestWordFile(files: $files) {
      url
    }
  }
`

const ingestWordFilesMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={INGEST_WORD_FILES}>
      {(ingestWordFiles, ingestWordFilesResult) =>
        render({ ingestWordFiles, ingestWordFilesResult })
      }
    </Mutation>
  )
}

export default ingestWordFilesMutation
