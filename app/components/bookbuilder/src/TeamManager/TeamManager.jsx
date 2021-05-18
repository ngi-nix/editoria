/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import GroupList from './GroupList'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Fira Sans Condensed';
  height: 100%;
  justify-content: space-between;
`
export class TeamManager extends React.Component {
  render() {
    const {
      teams,
      searchForUsers,
      updateTeam,
      rules,
      canViewAddTeamMember,
    } = this.props

    return (
      <Wrapper>
        <GroupList
          teams={teams}
          rules={rules}
          canViewAddTeamMember={canViewAddTeamMember}
          update={updateTeam}
          searchForUsers={searchForUsers}
        />
      </Wrapper>
    )
  }
}

TeamManager.propTypes = {
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      rev: PropTypes.string,
      teamType: PropTypes.shape({
        name: PropTypes.string,
        permissions: PropTypes.arrayOf(PropTypes.string),
      }),
      members: PropTypes.arrayOf(PropTypes.string),
      object: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
  ).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ),
  updateTeam: PropTypes.func.isRequired,
}

TeamManager.defaultProps = {
  users: null,
}

export default TeamManager
