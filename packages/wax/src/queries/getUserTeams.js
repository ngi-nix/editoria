import React from 'react'
import PropTypes from 'prop-types'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const CURRENT_USER_TEAM = gql`
  query($where: TeamWhereInput) {
    teams(where: $where) {
      name
      role
    }
  }
`

const getUserTeamsQuery = props => {
  const {
    currentUser: { id },
    render,
  } = props
  return (
    <Query
      fetchPolicy="network-only"
      query={CURRENT_USER_TEAM}
      variables={{ where: { users: [id] } }}
    >
      {render}
    </Query>
  )
}

getUserTeamsQuery.propTypes = {
  render: PropTypes.any, // eslint-disable-line
}

export default getUserTeamsQuery
