import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_TEMPLATE = gql`
  query GetTemplate($id: ID!) {
    getTemplate(id: $id) {
      id
      name
      thumbnail {
        name
        mimetype
        id
        source(size: small)
      }
      author
      trimSize
      notes
      target
      files {
        name
        mimetype
        id
        source
        extension
        objectKey
      }
    }
  }
`

const getTemplateQuery = props => {
  const { templateId: id, render } = props

  return (
    <Query
      fetchPolicy="network-only"
      notifyOnNetworkStatusChange
      query={GET_TEMPLATE}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export { GET_TEMPLATE }
export default getTemplateQuery
