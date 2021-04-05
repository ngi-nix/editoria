/* eslint-disable react/prop-types */

import React from 'react'
import { adopt } from 'react-adopt'
import {
  UpdatePasswordMutation,
  UpdatePersonalInformationMutation,
  // UpdateUsernameMutation,
} from './queries'
import UserProfile from './ui/UserProfile'

const mapper = {
  UpdatePasswordMutation,
  UpdatePersonalInformationMutation,
  // UpdateUsernameMutation,
}

const mapProps = args => {
  const updatePassword = input =>
    args.UpdatePasswordMutation.updatePassword({
      variables: {
        input,
      },
    })

  const updatePersonalInformation = input =>
    args.UpdatePersonalInformationMutation.updatePersonalInformation({
      variables: {
        input,
      },
    })

  // const updateUsername = input =>
  //   args.UpdateUsernameMutation.updateUsername({
  //     variables: {
  //       input,
  //     },
  //   })

  return {
    updatePassword,
    updatePersonalInformation,
    // updateUsername,
  }
}

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { currentUser } = props
  return (
    <Composed>
      {props => <UserProfile data={currentUser} {...props} />}
    </Composed>
  )
}
export default Connected
