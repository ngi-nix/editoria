import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_BOOK_COMPONENT_TYPE = gql`
  mutation UpdateBookComponentType($input: UpdateBookComponentInput!) {
    updateComponentType(input: $input) {
      id
    }
  }
`

const updateBookComponentTypeMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_BOOK_COMPONENT_TYPE}>
      {(updateComponentType, updateComponentTypeResult) =>
        render({ updateComponentType, updateComponentTypeResult })
      }
    </Mutation>
  )
}

export default updateBookComponentTypeMutation
