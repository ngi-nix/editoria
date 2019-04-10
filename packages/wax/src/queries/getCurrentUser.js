import React from 'react'
import PropTypes from 'prop-types'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      username
      admin
    }
  }
`

const getCurrentUserQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="network-only" query={CURRENT_USER}>
      {render}
    </Query>
  )
}

getCurrentUserQuery.propTypes = {
  render: PropTypes.any, // eslint-disable-line
}

export default getCurrentUserQuery
