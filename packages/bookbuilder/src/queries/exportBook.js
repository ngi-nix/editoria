import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const EXPORT_BOOK = gql`
  mutation ExportBook($input: ExportBookInput!) {
    exportBook(input: $input) {
      path
      validationResult
    }
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
