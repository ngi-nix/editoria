import React from 'react'
import { Query } from 'react-apollo'
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
      object {
        objectId
        objectType
      }
      members {
        id
        user {
          id
          type
          username
          email
          admin
        }
        status
        alias {
          name
          email
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
