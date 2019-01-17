import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOK_COMPONENT = gql`
  query GetBookComponent($id: ID!) {
    getBookComponent(id: $id) {
      id
      divisionId
      title
      bookId
      hasContent
      componentTypeOrder
      componentType
      trackChangesEnabled
      workflowStages {
        label
        type
        value
      }
      content
    }
  }
`

const getBookComponentQuery = props => {
  const { bookComponentId: id, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      query={GET_BOOK_COMPONENT}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK_COMPONENT }
export default getBookComponentQuery
