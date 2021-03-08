import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_BOOK_COMPONENT = gql`
  query GetBookComponent($id: ID!) {
    getBookComponent(id: $id) {
      id
      divisionId
      divisionType
      bookTitle
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
      lock {
        userId
        username
        created
        givenName
        isAdmin
        surname
        id
      }
      nextBookComponent {
        id
        title
        bookId
      }
      prevBookComponent {
        id
        title
        bookId
      }
      content
    }
  }
`

const getBookComponentQuery = props => {
  const { bookComponentId: id, render } = props

  return (
    <Query
      fetchPolicy="network-only"
      query={GET_BOOK_COMPONENT}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK_COMPONENT }
export default getBookComponentQuery
