import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const SEARCH_FOR_USERS = gql`
  mutation SearchForUsers($search: String!, $exclude: [ID]!) {
    searchForUsers(search: $search, exclude: $exclude) {
      id
      username
      givenName
      surname
      email
    }
  }
`

const searchForUsersMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={SEARCH_FOR_USERS}>
      {(searchForUsers, searchForUsersResult) =>
        render({ searchForUsers, searchForUsersResult })
      }
    </Mutation>
  )
}

export { SEARCH_FOR_USERS }
export default searchForUsersMutation
