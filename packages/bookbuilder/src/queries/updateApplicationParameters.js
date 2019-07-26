import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPDATE_APPLICATION_PARAMETERS = gql`
  mutation UpdateApplicationParameters($input: updateParametersInput!) {
    updateApplicationParameters(input: $input) {
      id
    }
  }
`

const updateApplicationParametersMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_APPLICATION_PARAMETERS}>
      {(updateApplicationParameter, updateApplicationParameterResult) =>
        render({
          updateApplicationParameter,
          updateApplicationParameterResult,
        })
      }
    </Mutation>
  )
}

export default updateApplicationParametersMutation
