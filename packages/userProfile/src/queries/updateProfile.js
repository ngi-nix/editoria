import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      id
      username
      admin
    }
  }
`

const GET_CURRENT_USER_PROFILE = gql`
  query CurrentUser {
    currentUser {
      id
      givenName
      surname
      username
    }
  }
`

const UPDATE_PERSONAL_INFORMATION = gql`
  mutation UpdatePersonalInformation($input: UpdatePersonalInformationInput!) {
    updatePersonalInformation(input: $input) {
      id
    }
  }
`

const UPDATE_USERNAME = gql`
  mutation UpdateUsername($input: UpdateUsernameInput!) {
    updateUsername(input: $input) {
      id
    }
  }
`

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input)
  }
`

const UpdatePersonalInformationMutation = props => {
  const { render } = props

  const refetchQueries = [
    { query: CURRENT_USER },
    { query: GET_CURRENT_USER_PROFILE },
  ]

  return (
    <Mutation
      mutation={UPDATE_PERSONAL_INFORMATION}
      refetchQueries={refetchQueries}
    >
      {(updatePersonalInformation, updatePersonalInformationResponse) =>
        render({ updatePersonalInformation, updatePersonalInformationResponse })
      }
    </Mutation>
  )
}

const UpdateUsernameMutation = props => {
  const { render } = props

  const refetchQueries = [
    { query: CURRENT_USER },
    { query: GET_CURRENT_USER_PROFILE },
  ]

  return (
    <Mutation mutation={UPDATE_USERNAME} refetchQueries={refetchQueries}>
      {(updateUsername, updateUsernameResponse) =>
        render({ updateUsername, updateUsernameResponse })
      }
    </Mutation>
  )
}

const UpdatePasswordMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPDATE_PASSWORD}>
      {(updatePassword, updatePasswordResponse) =>
        render({ updatePassword, updatePasswordResponse })
      }
    </Mutation>
  )
}

export {
  UpdatePasswordMutation,
  UpdateUsernameMutation,
  UpdatePersonalInformationMutation,
}
