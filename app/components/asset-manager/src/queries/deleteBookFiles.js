import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const DELETE_BOOK_FILES = gql`
  mutation DeleteBookFiles($ids: [ID!]!, $remoteToo: Boolean) {
    deleteFiles(ids: $ids, remoteToo: $remoteToo)
  }
`

const deleteBookFilesMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={DELETE_BOOK_FILES}>
      {(deleteFiles, deleteFilesResult) =>
        render({ deleteFiles, deleteFilesResult })
      }
    </Mutation>
  )
}

export default deleteBookFilesMutation
