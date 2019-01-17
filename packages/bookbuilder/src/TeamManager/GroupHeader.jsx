/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import styles from '../styles/teamManager.local.scss'

export class GroupHeader extends React.Component {
  render() {
    const { title, showInput, allowed, show } = this.props

    return (
      <div className={styles.groupHeader}>
        <div className={styles.groupTitle}>
          <h1> {title} </h1>
        </div>
        {allowed ? (
          <Authorize object={title} operation="can view add team member">
            <div className={styles.groupBtn} onClick={showInput}>
              {!show ? <div className={styles.addIcon} /> : null}
              <a>{!show ? `add ${title}` : 'hide input'}</a>
            </div>
          </Authorize>
        ) : null}

        <div className={styles.separator} />
      </div>
    )
  }
}

GroupHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showInput: PropTypes.func.isRequired,
}

export default GroupHeader
