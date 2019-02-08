/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import GlobalTeamsManager from './GlobalTeamsManager'
import { getUsersTeamsQuery } from './queries'

const mapper = {
  getUsersTeamsQuery,
}

const mapProps = args => ({
  users: get(args.getUsersTeamsQuery, 'data.users'),
  teams: get(args.getUsersTeamsQuery, 'data.getGlobalTeams'),
  loading: args.getUsersTeamsQuery.loading,
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({ users, teams, loading }) => {
      if (loading) return 'Loading...'
      return (
        <GlobalTeamsManager loading={loading} teams={teams} users={users} />
      )
    }}
  </Composed>
)

export default Connected
