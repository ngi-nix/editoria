import { findIndex, map } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { DefaultButton } from '../ui'

const ListItem = styled.li`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
`

const MemberContainer = styled.div`
  flex-basis: 90%;
  overflow-x: hidden;
  overflow-y: hidden;
`

const User = styled.span`
  background-color: white;
  font-family: ${th('fontReading')};
  font-size: ${th('fontSizeHeading5')};
  line-height: ${th('lineHeightHeading5')};
  overflow-y: hidden;
  padding-right: ${th('gridUnit')};
  word-wrap: break-word;
  &:after {
    content: '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . ';
    float: left;
    font-size: ${th('fontSizeBaseSmall')};
    padding-top: 3px;
    white-space: nowrap;
    width: 0;
  }
`
const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 10%;
  justify-content: center;
`
export class Member extends React.Component {
  constructor(props) {
    super(props)
    this._remove = this._remove.bind(this)
  }

  _remove() {
    const { user, team, update } = this.props

    const memberIndex = findIndex(team.members, { user: { id: user.id } })
    team.members.splice(memberIndex, 1)

    const withoutMember = map(team.members, member => {
      const { user } = member
      return { user: { id: user.id } }
    })

    update({
      variables: { id: team.id, input: { members: withoutMember } },
    })
  }

  render() {
    const { team, rules, user } = this.props
    const { canRemoveTeamMember } =
      rules.teamRoles.find(rule => rule.role === team.role) || {}

    return (
      <ListItem>
        <MemberContainer>
          <User>{`${user.givenName} ${user.surname}`}</User>
        </MemberContainer>

        {canRemoveTeamMember && (
          <ActionsContainer>
            <DefaultButton label="Remove" onClick={this._remove} />
          </ActionsContainer>
        )}
      </ListItem>
    )
  }
}

Member.propTypes = {
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  color: PropTypes.string.isRequired,
  team: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    rev: PropTypes.string,
    role: PropTypes.shape({
      name: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.string),
    }),
    members: PropTypes.arrayOf(PropTypes.string),
    object: PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
  update: PropTypes.func.isRequired,
  remove: PropTypes.bool.isRequired,
}

export default Member
