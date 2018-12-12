import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOK = gql`
  query GetBook {
    getBook {
      title
      divisions {
        label
        bookComponents {
          id
          title
          componentTypeOrder
          lock {
            created
            username
          }
          pagination {
            left
            right
          }
          workflowStages {
            label
            value
          }
          componentType
          uploading
        }
      }
    }
  }
`

const getBookQuery = props => {
  const { render } = props
  return (
    <Query fetchPolicy="cache-and-network" query={GET_BOOK}>
      {render}
    </Query>
  )
}

export { GET_BOOK }
export default getBookQuery
