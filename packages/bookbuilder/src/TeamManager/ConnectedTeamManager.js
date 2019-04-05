/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import TeamManagerModal from './TeamManagerModal'
import {
  getBookTeamsQuery,
  getBookBuilderRulesQuery,
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
  getBookBuilderRulesQuery,
  addTeamMemberSubscription,
}

const mapProps = args => ({
  teams: get(args.getBookTeamsQuery, 'data.getBookTeams'),
  findUser: args.findUserMutation.findUser,
  updateTeam: args.updateTeamMutation.updateBookTeam,
  refetching:
    args.getBookTeamsQuery.networkStatus === 4 ||
    args.getBookTeamsQuery.networkStatus === 2, // possible apollo bug
  refetchingBookBuilderRules:
    args.getBookBuilderRulesQuery.networkStatus === 4 ||
    args.getBookBuilderRulesQuery.networkStatus === 2, // possible apollo bug
  loading: args.getBookTeamsQuery.networkStatus === 1,
  loadingRules: args.getBookBuilderRulesQuery.networkStatus === 1,
  rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
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
        return (
          <TeamManagerModal
            book={book}
            loadingRules={loadingRules}
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
