import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_FILES = gql`
  query GetFiles(
    $bookId: ID!
    $ascending: Boolean = true
    $sortKey: String = "label"
  ) {
    getFiles(bookId: $bookId, ascending: $ascending, sortKey: $sortKey) {
      id
      # label
      # mimetype
      # size
      # alt
      # description
    }
  }
`

const getFilesQuery = props => {
  const { bookId, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_FILES}
      variables={{ bookId }}
    >
      {render}
    </Query>
  )
}

export { GET_FILES }
export default getFilesQuery
