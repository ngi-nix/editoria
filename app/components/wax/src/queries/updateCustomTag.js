import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPDATE_CUSTOM_TAG = gql`
  mutation UpdateCustomTag($input: [CustomTagUpdateInput]!) {
    updateCustomTag(input: $input) {
      id
      label
      tagType
    }
  }
`

const updateCustomTagMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_CUSTOM_TAG}>
      {updateCustomTag => render({ updateCustomTag })}
    </Mutation>
  )
}

export default updateCustomTagMutation
