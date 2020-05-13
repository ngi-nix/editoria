import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_ENTITY_FILES = gql`
  query GetEntityFilesQuery($input: EntityFilesInput) {
    getEntityFiles(input: $input) {
      id
      name
      alt
      source(size: small)
      mimetype
      size
      updated
      metadata {
        width
        height
        space
        density
      }
    }
  }
`

const getEntityFilesQuery = props => {
  const { entityId, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_ENTITY_FILES}
      variables={{
        input: {
          entityId,
          entityType: 'book',
          sortingParams: [
            { key: 'name', order: 'asc' },
            { key: 'updated', order: 'asc' },
          ],
        },
      }}
    >
      {render}
    </Query>
  )
}

export { GET_ENTITY_FILES }
export default getEntityFilesQuery
