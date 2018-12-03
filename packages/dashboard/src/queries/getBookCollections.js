import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOK_COLLECTIONS = gql`
  query GetBookCollections {
    getBookCollections {
      id
      title
      books {
        id
        title
      }
    }
  }
`

const getBookCollectionsQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="cache-and-network" query={GET_BOOK_COLLECTIONS}>
      {render}
    </Query>
  )
}

export { GET_BOOK_COLLECTIONS }
export default getBookCollectionsQuery
