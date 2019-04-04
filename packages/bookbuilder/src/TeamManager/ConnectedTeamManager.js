/* eslint-disable no-console */

import React from 'react'
import { get, forEach } from 'lodash'
import { adopt } from 'react-adopt'
import TeamManagerModal from './TeamManagerModal'
import {
  getBookTeamsQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
} from '../queries'

const mapper = {
  getBookTeamsQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
}

const mapProps = args => {

  console.log('asdfasdfa', args)
  return {
    teams: get(args.getBookTeamsQuery, 'data.getBookTeams'),
    findUser: args.findUserMutation.findUser,
    updateTeam: args.updateTeamMutation.updateBookTeam,
    loading: args.getBookTeamsQuery.networkStatus === 1,
    refetching:
      args.getBookTeamsQuery.networkStatus === 4 ||
      args.getBookTeamsQuery.networkStatus === 2, // possible apollo bug
  }
}

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { data, isOpen, hideModal } = props
  const { bookId } = data

  return (
    <Composed bookId={bookId}>
      {({ teams, loading, refetching, findUser, updateTeam }) => {
        return (
          <TeamManagerModal
            bookId={bookId}
            isOpen={isOpen}
            loading={loading}
            hideModal={hideModal}
            refetching={refetching}
            findUser={findUser}
            teams={teams}
            updateTeam={updateTeam}
          />
        )
      }}
    </Composed>
  )
}

export default Connected
