import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import GroupHeader from './GroupHeader'
import AddMember from './AddMember'
import MemberList from './MemberList'

export class Group extends React.Component {
  constructor(props) {
    super(props)

    this._showAddMember = this._showAddMember.bind(this)
    this._closeAddMember = this._closeAddMember.bind(this)

    this.state = {
      isAddMemberOpen: false,
    }
  }

  _showAddMember() {
    this.setState({ isAddMemberOpen: !this.state.isAddMemberOpen })
  }

  _closeAddMember() {
    this.setState({ isAddMemberOpen: false })
  }

  render() {
    const {
      team,
      searchForUsers,
      options,
      update,
      rules,
      canViewAddTeamMember,
    } = this.props
    const { members } = team

    const allowed = true

    return (
      <Fragment>
        <GroupHeader
          allowed={allowed}
          canViewAddTeamMember={canViewAddTeamMember}
          show={this.state.isAddMemberOpen}
          showInput={this._showAddMember}
          title={options.title}
        />

        <MemberList
          color={options.color}
          members={members}
          rules={rules}
          team={team}
          update={update}
        />
        <AddMember
          hideInput={this._closeAddMember}
          searchForUsers={searchForUsers}
          show={this.state.isAddMemberOpen}
          team={team}
          update={update}
        />
      </Fragment>
    )
  }
}

Group.propTypes = {
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
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ).isRequired,
  options: PropTypes.shape({
    addButtonText: PropTypes.string,
    color: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  update: PropTypes.func.isRequired,
}

export default Group
