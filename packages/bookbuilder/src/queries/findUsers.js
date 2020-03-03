import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const FIND_USER = gql`
  mutation FindUser($search: String!, $exclude: [ID]!) {
    findUser(search: $search, exclude: $exclude) {
      id
      username
      givenName
      surname
      email
    }
  }
`

const findUserMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={FIND_USER}>
      {(findUser, findUserResult) => render({ findUser, findUserResult })}
    </Mutation>
  )
}

export { FIND_USER }
export default findUserMutation
