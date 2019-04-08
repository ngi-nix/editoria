import React from 'react'
import PropTypes from 'prop-types'

import AbstractModal from 'editoria-common/src/AbstractModal'
import TeamManager from './TeamManager'

class TeamManagerModal extends React.Component {
  renderBody() {
    const {
      teams,
      findUser,
      updateTeam,
      book,
      rules,
      canViewAddTeamMember,
    } = this.props

    return (
      <TeamManager
        book={book}
        canViewAddTeamMember={canViewAddTeamMember}
        findUser={findUser}
        rules={rules}
        teams={teams}
        updateTeam={updateTeam}
      />
    )
  }

  render() {
    const { container, show, toggle, loading, loadingRules } = this.props
    if (loading || loadingRules) return null
    const body = this.renderBody()

    return (
      <AbstractModal
        body={body}
        cancelText="Close"
        container={container}
        show={show}
        size="large"
        title="Editoria Team Manager"
        toggle={toggle}
      />
    )
  }
}

TeamManagerModal.propTypes = {
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
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
  toggle: PropTypes.func.isRequired,
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

TeamManagerModal.defaultProps = {
  users: null,
}

export default TeamManagerModal
