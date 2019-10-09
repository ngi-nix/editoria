import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

const GET_TEMPLATES = gql`
  query GetTemplates($target: String) {
    getTemplates(target: $target) {
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
