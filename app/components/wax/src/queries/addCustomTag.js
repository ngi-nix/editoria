import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const ADD_CUSTOM_TAG = gql`
  mutation AddCustomTag($input: CustomTagAddInput!) {
    addCustomTag(input: $input) {
      id
      label
      tagType
    }
  }
`

const addCustomTagMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={ADD_CUSTOM_TAG}>
      {addCustomTag => render({ addCustomTag })}
    </Mutation>
  )
}

export default addCustomTagMutation
