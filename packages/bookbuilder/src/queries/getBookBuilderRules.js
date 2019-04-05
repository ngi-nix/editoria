import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_BOOKBUILDER_RULES = gql`
  query GetBookBuilderRules($id: ID!) {
    getBookBuilderRules(id: $id) {
      id
      canViewAddComponent
      canReorderBookComponent
      canViewUploadButton
      canViewMultipleFilesUpload
      canViewTeamManager
      canViewStateList
      canViewAlignmentTool
      exportBook
      downloadEPUB
      canViewAddTeamMember
      teamRoles {
        role
        canRemoveTeamMember
      }
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
