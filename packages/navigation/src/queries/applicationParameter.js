import React from 'react'
import PropTypes from 'prop-types'

import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const APPLICATION_PARAMETER = gql`
  query ApplicationParameters($context: String, $area: String) {
    getApplicationParameters(context: $context, area: $area) {
      id
      context
      area
      config
    }
  }
`

const ApplicationParameterQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="network-only" query={APPLICATION_PARAMETER}>
      {render}
    </Query>
  )
}

ApplicationParameterQuery.propTypes = {
  render: PropTypes.any, // eslint-disable-line
}

export default ApplicationParameterQuery
