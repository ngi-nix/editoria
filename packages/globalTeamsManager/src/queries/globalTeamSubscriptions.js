import React from 'react'
import { Subscription } from '@apollo/react-components'
import gql from 'graphql-tag'

const TEAM_MEMBERS_UPDATED_SUBSCRIPTION = gql`
  subscription TeamMembersUpdated {
    teamMembersUpdated {
      bookId
      teamId
      role
      members {
        id
        username
        email
        admin
      }
    }
  }
`

const addTeamMemberSubscription = props => {
  const { render, getUsersTeamsQuery } = props
  const triggerRefetch = () => {
    getUsersTeamsQuery.refetch()
  }
  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEAM_MEMBERS_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export default addTeamMemberSubscription
