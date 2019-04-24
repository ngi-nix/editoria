/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import GroupList from './GroupList'
import styles from '../styles/teamManager.local.scss'

const CancelButton = styled.button`
  align-items: center;
  margin-top:auto;
  cursor: pointer;
  background: none;
  border: none;
  color: #828282;
  display: flex;
  align-self: center;
  padding: 0;
  border-bottom: 1px solid ${th('colorBackground')};

  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
  }
  &:not(:disabled):active {
    border: none;
    color: ${th('colorPrimary')};
    outline: none;
    border-bottom: 1px solid ${th('colorPrimary')};
  }
  &:focus {
    outline: 0;
  }
`
const ButtonLabel = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  font-weight: normal;
`
export class TeamManager extends React.Component {
  render() {
    const {
      teams,
      // users,
      findUser,
      hideModal,
      updateTeam,
      // bookId,
      rules,
      canViewAddTeamMember,
    } = this.props

    return (
      <div className={styles.teamManager}>
        <GroupList
          teams={teams}
          rules={rules}
          canViewAddTeamMember={canViewAddTeamMember}
          // bookId={bookId}
          update={updateTeam}
          findUser={findUser}
        />
        <CancelButton type="submit" onClick={hideModal}>
          <ButtonLabel>Cancel</ButtonLabel>
        </CancelButton>
      </div>
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
