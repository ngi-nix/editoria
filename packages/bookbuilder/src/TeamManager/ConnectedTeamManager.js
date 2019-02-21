/* eslint-disable no-console */

import React from 'react'
import { get, find, findIndex, difference, forEach } from 'lodash'
import { adopt } from 'react-adopt'
import TeamManagerModal from './TeamManagerModal'
import {
  getBookTeamsQuery,
  findUserMutation,
  updateTeamMutation,
} from '../queries'

import { TEAM_MEMBERS_UPDATED_SUBSCRIPTION } from '../queries/bookBuilderSubscriptions'

const mapper = {
  getBookTeamsQuery,
  findUserMutation,
  updateTeamMutation,
}

const mapProps = args => ({
  teams: get(args.getBookTeamsQuery, 'data.getBookTeams'),
  findUser: args.findUserMutation.findUser,
  updateTeam: args.updateTeamMutation.updateBookTeam,
  subscribeToMore: get(args.getBookTeamsQuery, 'subscribeToMore'),
  loading: args.getBookTeamsQuery.loading,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { book, container, show, toggle } = props

  return (
    <Composed bookId={book.id}>
      {({ teams, loading, findUser, updateTeam, subscribeToMore }) => {
        if (loading) return null

        return (
          <TeamManagerModal
            book={book}
            container={container}
            findUser={findUser}
            show={show}
            teams={teams}
            toggle={toggle}
            updateTeam={updateTeam}
            subscribeToMoreTeamMembers={() =>
              subscribeToMore({
                document: TEAM_MEMBERS_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const { teamMembersUpdated } = subscriptionData.data
                  const copy = Object.assign({}, prev)
                  forEach(copy.getBookTeams, team => {
                    if (team.objectId === teamMembersUpdated.bookId) {
                      if (teamMembersUpdated.teamId === team.id) {
                        team.members = teamMembersUpdated.members
                      }
                    }
                  })
                  return Object.assign({}, prev, copy)
                },
              })
            }
          />
        )
      }}
    </Composed>
  )
}

export default Connected
