import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_USERS_TEAMS = gql`
  query GetUsersTeams {
    users {
      id
      type
      username
      email
      admin
    }

    getGlobalTeams {
      id
      type
      role
      name
      members {
        id
        user {
          id
          username
          email
          admin
        }
      }
      global
    }
  }
`

const getUsersTeamsQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="cache-and-network" query={GET_USERS_TEAMS}>
      {render}
    </Query>
  )
}

export { GET_USERS_TEAMS }
export default getUsersTeamsQuery
