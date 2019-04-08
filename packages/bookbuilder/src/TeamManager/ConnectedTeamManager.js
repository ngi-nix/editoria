/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import TeamManagerModal from './TeamManagerModal'
import {
  getBookTeamsQuery,
  getBookBuilderRulesQuery,
  findUserMutation,
  updateTeamMutation,
  teamMembersChangeSubscription,
  addTeamMemberSubscription,
} from '../queries'

const mapper = {
  getBookBuilderRulesQuery,
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
      }) => (
        <TeamManagerModal
          book={book}
          canViewAddTeamMember={rules.canViewAddTeamMember}
          container={container}
          findUser={findUser}
          loading={loading}
          loadingRules={loadingRules}
          refetching={refetching}
          rules={rules}
          show={show}
          teams={teams}
          toggle={toggle}
          updateTeam={updateTeam}
        />
      )}
    </Composed>
  )
}

export default Connected
