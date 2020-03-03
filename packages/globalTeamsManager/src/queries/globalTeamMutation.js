import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPDATE_GLOBAL_TEAM = gql`
  mutation updateGlobalTeam($id: String!, $input: TeamInput!) {
    updateTeamMembers(id: $id, input: $input) {
      id
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
const globalTeamMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_GLOBAL_TEAM}>
      {(updateGlobalTeam, updateGlobalTeamResult) =>
        render({ updateGlobalTeam, updateGlobalTeamResult })
      }
    </Mutation>
  )
}

export default globalTeamMutation
