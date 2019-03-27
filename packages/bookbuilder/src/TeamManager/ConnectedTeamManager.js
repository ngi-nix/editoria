/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import TeamManagerModal from './TeamManagerModal'
import {
  getBookTeamsQuery,
  getDashboardRulesQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
  addTeamMemberSubscription,
} from '../queries'

const mapper = {
  getDashboardRulesQuery,
  getBookTeamsQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
  addTeamMemberSubscription,
}

const mapProps = args => ({
  teams: get(args.getBookTeamsQuery, 'data.getBookTeams'),
  findUser: args.findUserMutation.findUser,
  updateTeam: args.updateTeamMutation.updateBookTeam,
  refetching:
    args.getBookTeamsQuery.networkStatus === 4 ||
    args.getBookTeamsQuery.networkStatus === 2, // possible apollo bug
  loading: args.getBookTeamsQuery.networkStatus === 1,
  loadingRules: args.getDashboardRulesQuery.loading,
  rules: get(args.getDashboardRulesQuery, 'data.getDashBoardRules'),
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { book, container, show, toggle } = props

  return (
    <Composed bookId={book.id}>
      {({
        teams,
        loading,
        loadingRules,
        rules,
        findUser,
        refetching,
        updateTeam,
      }) => {
        if (loading || loadingRules) return null

        return (
          <TeamManagerModal
            book={book}
            canViewAddTeamMember={rules.canViewAddTeamMember}
            container={container}
            findUser={findUser}
            loading={loading}
            refetching={refetching}
            rules={rules.bookRules.find(bookrule => bookrule.id === book.id)}
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
