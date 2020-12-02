import React from 'react'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'

const GET_PAGED_PREVIEWER_LINK = gql`
  query GetPagedPreviewerLink($hash: String!) {
    getPagedPreviewerLink(hash: $hash) {
      link
    }
  }
`

const getPagedPreviewerLinkQuery = props => {
  const { hash, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_PAGED_PREVIEWER_LINK}
      variables={{ hash }}
    >
      {render}
    </Query>
  )
}

export { GET_PAGED_PREVIEWER_LINK }
export default getPagedPreviewerLinkQuery
