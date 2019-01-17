import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_BOOK_COMPONENT_TRACK_CHANGES = gql`
  mutation UpdateBookComponentTrackChanges($input: UpdateBookComponentInput!) {
    updateTrackChanges(input: $input) {
      id
      trackChangesEnabled
    }
  }
`

const updateBookComponentTrackChangesMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_COMPONENT_TRACK_CHANGES}>
      {(updateTrackChanges, updateTrackChangesResult) =>
        render({ updateTrackChanges, updateTrackChangesResult })
      }
    </Mutation>
  )
}

export default updateBookComponentTrackChangesMutation
