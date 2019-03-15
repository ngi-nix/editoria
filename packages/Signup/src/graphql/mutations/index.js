import gql from 'graphql-tag'

export const SIGNUP_USER = gql`
  mutation($input: EditoriaUserInput) {
    createEditoriaUser(input: $input) {
      id
      type
      username
      email
    }
  }
`
