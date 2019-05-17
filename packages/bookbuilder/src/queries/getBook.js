import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOK = gql`
  query GetBook($id: ID!) {
    getBook(id: $id) {
      id
      title
      productionEditors
      publicationDate
      edition
      copyrightStatement
      copyrightYear
      copyrightHolder
      isbn
      issn
      issnL
      license
      divisions {
        id
        label
        bookComponents {
          id
          divisionId
          title
          bookId
          # hasContent
          componentTypeOrder
          pagination {
            left
            right
          }
          workflowStages {
            label
            type
            value
          }
          lock {
            username
            created
            givenName
            isAdmin
            surname
          }
          componentType
          uploading
          archived
        }
      }
    }
  }
`

const getBookQuery = props => {
  const { bookId: id, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_BOOK}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export { GET_BOOK }
export default getBookQuery
