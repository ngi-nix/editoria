import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($input: CreateTemplateInput!) {
    createTemplate(input: $input) {
      id
      files {
        name
      }
    }
  }
`

const createTemplateMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={CREATE_TEMPLATE}>
      {(createTemplate, createTemplateResult) =>
        render({ createTemplate, createTemplateResult })
      }
    </Mutation>
  )
}

export default createTemplateMutation
