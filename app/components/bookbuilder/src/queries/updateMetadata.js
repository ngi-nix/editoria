import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPDATE_BOOK_METADATA = gql`
  mutation UpdateBookMetadata($input: MetadataInput!) {
    updateMetadata(input: $input) {
      id
    }
  }
`

const updateBookMetadataMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_METADATA}>
      {(updateMetadata, updateMetadataResult) =>
        render({
          updateMetadata,
          updateMetadataResult,
        })
      }
    </Mutation>
  )
}

export default updateBookMetadataMutation
