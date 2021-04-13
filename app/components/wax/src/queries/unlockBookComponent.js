import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UNLOCK_BOOK_COMPONENT = gql`
  mutation UnlockBookComponent($input: UpdateBookComponentInput!) {
    unlockBookComponent(input: $input) {
      id
      divisionId
      divisionType
      bookTitle
      title
      bookId
      hasContent
      componentTypeOrder
      componentType
      trackChangesEnabled
      workflowStages {
        label
        type
        value
      }
      lock {
        userId
        username
        created
        givenName
        isAdmin
        surname
        id
      }
    }
  }
`

const unlockBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UNLOCK_BOOK_COMPONENT}>
      {(unlockBookComponent, unlockBookComponentResult) =>
        render({ unlockBookComponent, unlockBookComponentResult })
      }
    </Mutation>
  )
}

export default unlockBookComponentMutation
