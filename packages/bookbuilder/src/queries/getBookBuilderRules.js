import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOKBUILDER_RULES = gql`
  query GetBookBuilderRules($id: ID!) {
    getBookBuilderRules(id: $id) {
      id
      canViewAddBookComponent
      canViewUploadButton
      canViewMultipleFilesUpload
      canViewTeamManager
      canViewStateList
      canViewAlignmentTool
      exportBook
      downloadEPUB
      bookComponentStateRules {
        id
        bookComponentId
        stage {
          type
          canChangeProgressList
          canChangeProgressListRight
          canChangeProgressListLeft
        }
      }
      canReorderBookComponent
    }
  }
`

const getBookBuilderRulesQuery = props => {
  const { bookId: id, render } = props

  return (
    <Query
      fetchPolicy="cache-and-network"
      query={GET_BOOKBUILDER_RULES}
      variables={{ id }}
    >
      {render}
    </Query>
  )
}

export default getBookBuilderRulesQuery
