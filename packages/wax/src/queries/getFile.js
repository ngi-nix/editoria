import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_FILE = gql`
  query GetFileQuery($id: ID!) {
    getFile(id: $id) {
      id
      alt
      source(size: medium)
    }
  }
`

const getFileQuery = props => {
  const { render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_FILE}
    >
      {render}
    </Query>
  )
}

export { GET_FILE }
export default getFileQuery
