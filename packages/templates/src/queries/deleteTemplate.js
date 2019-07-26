import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const DELETE_TEMPLATE = gql`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(id: $id)
  }
`

const deleteTemplateMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={DELETE_TEMPLATE}>
      {(deleteTemplate, deleteTemplateResult) =>
        render({ deleteTemplate, deleteTemplateResult })
      }
    </Mutation>
  )
}

export default deleteTemplateMutation
