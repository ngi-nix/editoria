import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($input: UpdateTemplateInput!) {
    updateTemplate(input: $input) {
      id
      files {
        name
      }
    }
  }
`

const updateTemplateMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_TEMPLATE}>
      {(updateTemplate, updateTemplateResult) =>
        render({ updateTemplate, updateTemplateResult })
      }
    </Mutation>
  )
}

export default updateTemplateMutation
