import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_TEMPLATES = gql`
  query GetTemplates(
    $ascending: Boolean = true
    $sortKey: String = "templateName"
  ) {
    getTemplates(ascending: $ascending, sortKey: $sortKey) {
      id
      templateName
    }
  }
`

const getTemplatesQuery = props => {
  const { render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_TEMPLATES}
    >
      {render}
    </Query>
  )
}

export { GET_TEMPLATES }
export default getTemplatesQuery
