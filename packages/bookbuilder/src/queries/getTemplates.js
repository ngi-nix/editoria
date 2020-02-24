import React from 'react'
import { ApolloConsumer } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_TEMPLATES = gql`
  query GetTemplates($target: String, $notes: String) {
    getTemplates(target: $target, notes: $notes) {
      id
      name
      notes
    }
  }
`

const getTemplatesQuery = props => {
  const { render } = props
  return (
    <ApolloConsumer>
      {client => render({ client, query: GET_TEMPLATES })}
    </ApolloConsumer>
  )
}

export { GET_TEMPLATES }
export default getTemplatesQuery
