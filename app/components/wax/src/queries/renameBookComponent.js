import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const RENAME_BOOK_COMPONENT_TITLE = gql`
  mutation RenameBookComponentTitle($input: UpdateBookComponentInput!) {
    renameBookComponent(input: $input) {
      id
      title
    }
  }
`

const renameBookComponentTitleMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={RENAME_BOOK_COMPONENT_TITLE}>
      {(renameBookComponent, renameBookComponentResult) =>
        render({ renameBookComponent, renameBookComponentResult })
      }
    </Mutation>
  )
}

export default renameBookComponentTitleMutation
