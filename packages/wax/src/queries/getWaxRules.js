import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_WAX_RULES = gql`
  query GetWaxRules($id: ID!) {
    getWaxRules(id: $id) {
      canEditFull
      canEditSelection
      canEditReview
    }
  }
`

const getWaxRulesQuery = props => {
  const { bookComponentId: id, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      query={GET_WAX_RULES}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export default getWaxRulesQuery
