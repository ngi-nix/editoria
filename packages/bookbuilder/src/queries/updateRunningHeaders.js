import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_RUNNING_HEADERS = gql`
  mutation UpdateRunningHeaders($input: [RunningHeadersInput!]!, $bookId: ID!) {
    updateRunningHeaders(input: $input, bookId: $bookId) {
      id
    }
  }
`

const updateRunningHeadersMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_RUNNING_HEADERS}>
      {(updateRunningHeaders, updateRunningHeadersResult) =>
        render({ updateRunningHeaders, updateRunningHeadersResult })
      }
    </Mutation>
  )
}

export default updateRunningHeadersMutation
