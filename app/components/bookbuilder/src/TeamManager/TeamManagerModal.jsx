import React from 'react'
import PropTypes from 'prop-types'

import CustomModal from '../../../common/src/CustomModal'
import ModalFooterDialog from '../../../common/src/ModalFooterDialog'
import TeamManager from './TeamManager'
import { Loading } from '../../../../ui'

const Footer = (
  <ModalFooterDialog showConfirmButton={false} textCancel="Close" />
)
class TeamManagerModal extends React.Component {
  renderBody() {
    const {
      teams,
      searchForUsers,
      updateTeam,
      rules,
      canViewAddTeamMember,
    } = this.props

    return (
      <TeamManager
        canViewAddTeamMember={canViewAddTeamMember}
        rules={rules}
        searchForUsers={searchForUsers}
        teams={teams}
        updateTeam={updateTeam}
      />
    )
  }

  render() {
    const { isOpen, hideModal, loading, loadingRules } = this.props
    if (loading || loadingRules) return <Loading />
    const body = this.renderBody()

    return (
      <CustomModal
        footerComponent={Footer}
        headerText="Book's Team Manager"
        isOpen={isOpen}
        onRequestClose={hideModal}
        shouldCloseOnOverlayClick={false}
        size="medium"
      >
        {body}
      </CustomModal>
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
