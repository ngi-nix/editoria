import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const EXPORT_BOOK = gql`
  mutation ExportBook(
    $bookId: ID!
    $mode: String!
    $templateId: ID
    $previewer: String
    $fileExtension: String
  ) {
    exportBook(
      bookId: $bookId
      mode: $mode
      templateId: $templateId
      previewer: $previewer
      fileExtension: $fileExtension
    )
  }
`

const exportBookMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={EXPORT_BOOK}>
      {(exportBook, exportBookResult) =>
        render({ exportBook, exportBookResult })
      }
    </Mutation>
  )
}

export default exportBookMutation
