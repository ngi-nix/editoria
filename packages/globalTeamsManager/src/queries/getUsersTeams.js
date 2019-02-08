import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_USERS_TEAMS = gql`
  query GetUsersTeams {
    users {
      id
      type
      username
      emai
      admin
    }

    getGlobalTeams {
      id
      type
      teamType
      name
      object {
        objectId
        objectType
      }
      members {
        id
        type
        username
        emai
        admin
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
