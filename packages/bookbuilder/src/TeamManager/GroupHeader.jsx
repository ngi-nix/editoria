/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles/teamManager.local.scss'

export class GroupHeader extends React.Component {
  render() {
    const { title, showInput, allowed, show, canViewAddTeamMember } = this.props

    return (
      <div className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <h1> {title} </h1>
        </div>
        {(allowed && canViewAddTeamMember) ? (
          <div className={styles.groupBtn} onClick={showInput}>
            
            {!show ? <span className={styles.addIcon} /> : null}
            <a>{!show ? `add ${title}` : 'hide input'}</a>
          </div>
        ) : null}
      </div>
    )
  }
}

GroupHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showInput: PropTypes.func.isRequired,
}

export default GroupHeader
