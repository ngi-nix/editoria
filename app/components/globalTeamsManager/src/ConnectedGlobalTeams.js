/* eslint-disable no-console */

import React from 'react'
import get from 'lodash/get'
import { adopt } from 'react-adopt'
import { Loading } from '../../../ui'

import GlobalTeamsManager from './GlobalTeamsManager'
import {
  getUsersTeamsQuery,
  globalTeamMutation,
  addTeamMemberSubscription,
} from './queries'

const mapper = {
  getUsersTeamsQuery,
  globalTeamMutation,
  addTeamMemberSubscription,
}

const mapProps = args => ({
  users: get(args.getUsersTeamsQuery, 'data.users'),
  teams: get(args.getUsersTeamsQuery, 'data.getGlobalTeams'),
  loading: args.getUsersTeamsQuery.loading,
  refetching:
    args.getUsersTeamsQuery.networkStatus === 4 ||
    args.getUsersTeamsQuery.networkStatus === 2, // possible apollo bug
  updateGlobalTeam: args.globalTeamMutation.updateGlobalTeam,
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({ users, teams, updateGlobalTeam, loading }) => {
      if (loading) return <Loading />
      return (
        <GlobalTeamsManager
          loading={loading}
          teams={teams}
          updateGlobalTeam={updateGlobalTeam}
          users={users}
        />
      )
    }}
  </Composed>
)

export default Connected
