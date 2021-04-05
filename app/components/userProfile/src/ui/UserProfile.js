/* eslint-disable react/prop-types */

import React, { Fragment } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'

import { H3, H4 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

import RibbonFeedback from './RibbonFeedback'
import { Loading, Button } from '../../../../ui'
import TextField from './TextField'
import Form from './Form'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 100%;
  height: 100%;
`
const Title = styled(H3)`
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin: 0;
  margin-right: calc(3 * ${th('gridUnit')});
  padding-bottom: 0;
  padding-top: 3px;
  text-transform: uppercase;
`
const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
  height: calc(100% - 80px);
`

const HeaderWrapper = styled.div`
  align-items: center;
  justify-content: flex-start;
  display: flex;
  position: sticky;
  background-color: white;
  height: calc(9 * ${th('gridUnit')});
  z-index: 1;
  top: 0;
  margin-bottom: calc(1 * ${th('gridUnit')});
`

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`

const InnerSectionWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: calc(${th('gridUnit')} * 2);
`

const SectionHeader = styled(H4)`
  color: ${th('colorText')};
  font-family: ${th('fontInterface')};
  font-weight: normal;
  margin: calc(${th('gridUnit')} * 2) 0;
`

const PersonalInformation = props => {
  const { givenName, surname, update } = props

  const initialValues = {
    givenName,
    surname,
  }

  const validations = yup.object().shape({
    givenName: yup.string().required('Given names are required'),
    surname: yup.string().required('Surname is required'),
  })

  return (
    <InnerSectionWrapper>
      <SectionHeader>Personal Information</SectionHeader>
      <RibbonFeedback
        keepSpaceOccupied={false}
        successMessage="Personal Information successfully updated"
      >
        {notifyRibbon => {
          const handleSubmit = (formValues, formkikBag) => {
            update(formValues).then(() => notifyRibbon(true))
          }

          return (
            <Form
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validations}
            >
              {formProps => {
                const {
                  errors,
                  handleBlur,
                  handleChange,
                  isValid,
                  touched,
                  values,
                } = formProps

                const disabled =
                  (values.givenName === initialValues.givenName &&
                    values.surname === initialValues.surname) ||
                  !isValid

                return (
                  <Fragment>
                    <TextField
                      error={errors.givenName}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      label="Given Name"
                      name="givenName"
                      touched={touched}
                      value={values.givenName}
                    />

                    <TextField
                      error={errors.surname}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      label="Surname"
                      name="surname"
                      touched={touched}
                      value={values.surname}
                    />

                    <Button
                      disabled={disabled}
                      label="Update"
                      title="Update"
                      type="submit"
                    />
                  </Fragment>
                )
              }}
            </Form>
          )
        }}
      </RibbonFeedback>
    </InnerSectionWrapper>
  )
}

// const Username = props => {
//   const { update, username } = props

//   const initialValues = {
//     username,
//   }

//   const validations = yup.object().shape({
//     username: yup.string().required('Username is required'),
//   })

//   return (
//     <InnerSectionWrapper>
//       <SectionHeader>Username</SectionHeader>
//       <RibbonFeedback
//         keepSpaceOccupied={false}
//         successMessage="Username successfully updated"
//       >
//         {notifyRibbon => {
//           const handleSubmit = (formValues, formikBag) => {
//             update(formValues).then(() => notifyRibbon(true))
//           }

//           return (
//             <Form
//               initialValues={initialValues}
//               onSubmit={handleSubmit}
//               validationSchema={validations}
//             >
//               {formProps => {
//                 const {
//                   errors,
//                   handleBlur,
//                   handleChange,
//                   isValid,
//                   touched,
//                   values,
//                 } = formProps

//                 const disabled =
//                   values.username === initialValues.username || !isValid

//                 return (
//                   <Fragment>
//                     <TextField
//                       error={errors.username}
//                       handleBlur={handleBlur}
//                       handleChange={handleChange}
//                       label="Username"
//                       name="username"
//                       touched={touched}
//                       value={values.username}
//                     />

//                     <Button
//                       disabled={disabled}
//                       label="Change username"
//                       title="Change username"
//                       type="submit"
//                     />
//                   </Fragment>
//                 )
//               }}
//             </Form>
//           )
//         }}
//       </RibbonFeedback>
//     </InnerSectionWrapper>
//   )
// }

const Password = props => {
  const { update } = props

  const initialValues = {
    currentPassword: '',
    newPassword1: '',
    newPassword2: '',
  }

  const validations = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword1: yup.string().required('New password is required'),
    newPassword2: yup
      .string()
      .required('Please re-enter your new password')
      .test(
        'new-password-match',
        'Passwords do not match',
        /* eslint-disable func-names */
        function(val) {
          return val === this.parent.newPassword1
        },
      ),
  })

  return (
    <InnerSectionWrapper>
      <SectionHeader>Change password</SectionHeader>
      <RibbonFeedback
        errorMessage="Current password is incorrect"
        keepSpaceOccupied={false}
        successMessage="Password successfully updated"
      >
        {notifyRibbon => {
          const handleSubmit = (formValues, formikBag) => {
            const { currentPassword, newPassword1 } = formValues
            const patch = {
              currentPassword,
              newPassword: newPassword1,
            }

            update(patch)
              .then(() => notifyRibbon(true))
              .catch(err => {
                const errorMessage = err.graphQLErrors[0].message
                  .split(':')
                  .pop()
                  .trim()

                const messages = [
                  'Current password is not valid',
                  'New password must be different from current password',
                ]

                let msg = 'Something went wrong!'
                if (messages.includes(errorMessage)) msg = errorMessage

                notifyRibbon(false, msg)
              })
          }

          return (
            <Form
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validationSchema={validations}
            >
              {formProps => {
                const {
                  errors,
                  handleBlur,
                  handleChange,
                  isValid,
                  touched,
                  values,
                } = formProps

                return (
                  <Fragment>
                    <TextField
                      error={errors.currentPassword}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      label="Current password"
                      name="currentPassword"
                      touched={touched}
                      type="password"
                      value={values.currentPassword}
                    />

                    <TextField
                      error={errors.newPassword1}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      label="New password"
                      name="newPassword1"
                      touched={touched}
                      type="password"
                      value={values.newPassword1}
                    />

                    <TextField
                      error={errors.newPassword2}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      label="Repeat new password"
                      name="newPassword2"
                      touched={touched}
                      type="password"
                      value={values.newPassword2}
                    />

                    <Button
                      disabled={!isValid}
                      label="Change password"
                      title="Change password"
                      type="submit"
                    />
                  </Fragment>
                )
              }}
            </Form>
          )
        }}
      </RibbonFeedback>
    </InnerSectionWrapper>
  )
}

const UserProfile = props => {
  const {
    data,
    loading,
    updatePassword,
    updatePersonalInformation,
    // updateUsername,
  } = props

  if (loading) return <Loading />
  const { givenName, surname } = data

  return (
    <Container>
      <InnerWrapper>
        <HeaderWrapper>
          <Title>User Profile</Title>
        </HeaderWrapper>
        <SectionWrapper>
          <PersonalInformation
            givenName={givenName}
            surname={surname}
            update={updatePersonalInformation}
          />
          {/* <Username update={updateUsername} username={username} /> */}
          <Password update={updatePassword} />
        </SectionWrapper>
      </InnerWrapper>
    </Container>
  )
}

export default UserProfile
