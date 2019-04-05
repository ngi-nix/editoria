import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_DASHBOARD_RULES = gql`
  query GetDashBoardRules {
    getDashBoardRules {
      canAddBooks
      bookRules {
        id
        canRenameBooks
        canDeleteBooks
      }
    }
  }
`

const getDashboardRulesQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="cache-and-network" query={GET_DASHBOARD_RULES}>
      {render}
    </Query>
  )
}

export default getDashboardRulesQuery
