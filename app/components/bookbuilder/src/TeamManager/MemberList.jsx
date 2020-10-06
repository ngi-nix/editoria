/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Member from './Member'

const MemberListContainer = styled.ul`
  list-style-type: none;
  margin: calc(2 * ${th('gridUnit')}) 0 calc(2 * ${th('gridUnit')}) 0;
  padding: 0 calc(2 * ${th('gridUnit')}) 0 calc(2 * ${th('gridUnit')});
`

export class MemberList extends React.Component {
  render() {
    const { members, color, team, update, rules } = this.props
    const list = members.map(member => (
      <Member
        color={color}
        key={member.id}
        rules={rules}
        team={team}
        update={update}
        user={member.user}
        users={[]}
      />
    ))

    return <MemberListContainer>{list}</MemberListContainer>
  }
}

MemberList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.any).isRequired,
  team: PropTypes.shape({
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
  }).isRequired,
  update: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
}

export default MemberList
