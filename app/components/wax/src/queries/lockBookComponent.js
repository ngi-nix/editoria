import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const LOCK_BOOK_COMPONENT = gql`
  mutation LockBookComponent($input: UpdateBookComponentInput!) {
    lockBookComponent(input: $input) {
      id
    }
  }
`

const lockBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={LOCK_BOOK_COMPONENT}>
      {(lockBookComponent, lockBookComponentResult) =>
        render({ lockBookComponent, lockBookComponentResult })
      }
    </Mutation>
  )
}

export default lockBookComponentMutation
