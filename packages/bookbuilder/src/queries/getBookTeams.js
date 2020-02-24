import React from 'react'
import { Query } from '@apollo/react-components'
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
      fetchPolicy="cache-first"
      notifyOnNetworkStatusChange
      query={GET_BOOK_TEAMS}
      variables={{ bookId }}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK_TEAMS }
export default getBookTeamsQuery
