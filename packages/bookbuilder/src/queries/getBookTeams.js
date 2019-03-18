import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOK_TEAMS = gql`
  query GetBookTeams($bookId: ID!) {
    getBookTeams(bookId: $bookId) {
      id
      role
      name
      object {
        objectId
      }
      members {
        id
        user {
          id
          username
          surname
          givenName
          email
          admin
        }
      }
      global
    }
  }
`

const getBookTeamsQuery = props => {
  const { bookId, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      query={GET_BOOK_TEAMS}
      variables={{ bookId }}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK_TEAMS }
export default getBookTeamsQuery
