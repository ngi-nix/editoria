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

const mapProps = args => ({
  teams: get(args.getBookTeamsQuery, 'data.getBookTeams'),
  findUser: args.findUserMutation.findUser,
  updateTeam: args.updateTeamMutation.updateBookTeam,
  loading: args.getBookTeamsQuery.networkStatus === 1,
  refetching:
    args.getBookTeamsQuery.networkStatus === 4 ||
    args.getBookTeamsQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { book, container, show, toggle } = props

  return (
    <Composed bookId={book.id}>
      {({ teams, loading, refetching, findUser, updateTeam }) => {
        return (
          <TeamManagerModal
            book={book}
            loading={loading}
            refetching={refetching}
            container={container}
            findUser={findUser}
            show={show}
            teams={teams}
            toggle={toggle}
            updateTeam={updateTeam}
          />
        )
      }}
    </Composed>
  )
}

export default Connected
