import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const TOGGLE_INCLUDE_IN_TOC = gql`
  mutation ToggleIncludeInTOC($input: UpdateBookComponentInput!) {
    toggleIncludeInTOC(input: $input) {
      id
    }
  }
`

const toggleIncludeInTOCMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={TOGGLE_INCLUDE_IN_TOC}>
      {(toggleIncludeInTOC, toggleIncludeInTOCResult) =>
        render({ toggleIncludeInTOC, toggleIncludeInTOCResult })
      }
    </Mutation>
  )
}

export default toggleIncludeInTOCMutation
