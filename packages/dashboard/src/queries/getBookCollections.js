import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOK_COLLECTIONS = gql`
  query GetBookCollections(
    $ascending: Boolean = true
    $archived: Boolean = false
    $sortKey: String = "title"
  ) {
    getBookCollections {
      id
      title
      books(ascending: $ascending, sortKey: $sortKey, archived: $archived) {
        id
        title
        publicationDate
        archived
        authors {
          username
          givenName
          surname
        }
      }
    }
  }
`

const getBookCollectionsQuery = props => {
  const { render } = props

  return (
    <Query
      fetchPolicy="cache-first"
      notifyOnNetworkStatusChange
      query={GET_BOOK_COLLECTIONS}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK_COLLECTIONS }
export default getBookCollectionsQuery
