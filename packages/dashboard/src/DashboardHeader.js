import React from 'react'
import PropTypes from 'prop-types'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import styles from './dashboard.local.scss'

const DashboardHeader = props => {
  const { title, toggle } = props

  return (
    <div className="col-lg-12">
      <h1 className={styles.bookTitle}>{title}</h1>
      <Authorize operation="can add books">
        <div className={styles.addBookBtn} onClick={toggle}>
          <div className={styles.addBookIcon} />
          <a>add book</a>
        </div>
      </Authorize>
    </div>
  )
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default DashboardHeader
