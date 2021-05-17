import { find, keys } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Group from './Group'

const ListWrapper = styled.div`
  flex: 1;
`

export class GroupList extends React.Component {
  constructor(props) {
    super(props)

    this.options = {
      productionEditor: {
        color: 'blue',
        title: 'Production Editor',
      },
      copyEditor: {
        color: 'purple',
        title: 'Copy Editors',
        addButtonText: 'add copy editor',
      },
      author: {
        color: 'yellow',
        title: 'Authors',
        addButtonText: 'add author',
      },
    }
  }

  render() {
    const {
      teams,
      searchForUsers,
      update,
      rules,
      canViewAddTeamMember,
    } = this.props
    const { options } = this

    const groups = keys(options).map((key, i) => {
      const team = find(teams, team => team.role === key)
      if (!team) return null

      return (
        <Group
          canViewAddTeamMember={canViewAddTeamMember}
          key={team.role}
          options={options[team.role]}
          rules={rules}
          searchForUsers={searchForUsers}
          team={team}
          update={update}
        />
      )
    })
    return <ListWrapper>{groups}</ListWrapper>
  }
}

GroupList.propTypes = {
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
  update: PropTypes.func.isRequired,
}

GroupList.defaultProps = {
  users: null,
}

export default GroupList
