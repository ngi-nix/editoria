import React from 'react'
import { ApolloConsumer } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_SPECIFIC_FILES = gql`
  query GetSpecificFilesQuery($ids: [ID!]!) {
    getSpecificFiles(ids: $ids) {
      id
      alt
      source(size: medium)
      mimetype(target: editor)
    }
  }
`

const getSpecificFilesQuery = props => {
  const { render } = props
  return (
    <ApolloConsumer>
      {client => render({ client, query: GET_SPECIFIC_FILES })}
    </ApolloConsumer>
  )
}

export { GET_SPECIFIC_FILES }
export default getSpecificFilesQuery
