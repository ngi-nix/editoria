import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const EXPORT_BOOK = gql`
  mutation ExportBook(
    $bookId: ID!
    $destination: String!
    $converter: String
    $previewer: String
    $style: String
  ) {
    exportBook(
      bookId: $bookId
      destination: $destination
      converter: $converter
      previewer: $previewer
      style: $style
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
