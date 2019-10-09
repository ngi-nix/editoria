/* eslint-disable react/prop-types */

import React, { Fragment } from 'react'
import styled from 'styled-components'
import * as yup from 'yup'

import { Button, H3, H4 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

import RibbonFeedback from './RibbonFeedback'
import Loading from './Loading'
import { TextField } from './formElements'
import { Form } from './form'

const Wrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
`

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: calc(3 * ${th('gridUnit')});
`

const Header = styled(H3)`
  border-bottom: solid 1px black;
  align-items: flex-start;
  display: flex;
  position: sticky;
  background-color: white;
  height: 48px;
  z-index: 1;
  top: 0;
  margin-bottom: calc(3 * ${th('gridUnit')});
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin-right: calc(3 * ${th('gridUnit')});
  padding-bottom: 0;
  padding-top: 3px;
  text-transform: uppercase;
`

const Separator = styled.div`
  border-bottom: 1px solid ${th('colorFurniture')};
  height: ${th('gridUnit')};
  width: 100%;
`

const SectionWrapper = styled.div`
  margin-bottom: calc(${th('gridUnit')} * 2);
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`

const PasswordWrapper = styled.div`
  margin-bottom: calc(${th('gridUnit')} * 2);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SectionHeader = styled(H4)`
  margin: calc(${th('gridUnit')} * 2) 0;
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
`

const UpdateButton = styled(Button)`
  width: 50%;
  background: #404040;
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
    <InnerWrapper>
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
                      label="Surame"
                      name="surname"
                      touched={touched}
                      value={values.surname}
                    />

                    <UpdateButton disabled={disabled} primary type="submit">
                      Update
                    </UpdateButton>
                  </Fragment>
                )
              }}
            </Form>
          )
        }}
      </RibbonFeedback>
    </InnerWrapper>
  )
}

const Username = props => {
  const { update, username } = props

  const initialValues = {
    username,
  }

  const validations = yup.object().shape({
    username: yup.string().required('Username is required'),
  })

  return (
    <InnerWrapper>
      <SectionHeader>Username</SectionHeader>
      <RibbonFeedback
        keepSpaceOccupied={false}
        successMessage="Username successfully updated"
      >
        {notifyRibbon => {
          const handleSubmit = (formValues, formikBag) => {
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
                  values.username === initialValues.username || !isValid

                return (
                  <Fragment>
                    <TextField
                      error={errors.username}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      label="Username"
                      name="username"
                      touched={touched}
                      value={values.username}
                    />

                    <UpdateButton disabled={disabled} primary type="submit">
                      Change username
                    </UpdateButton>
                  </Fragment>
                )
              }}
            </Form>
          )
        }}
      </RibbonFeedback>
    </InnerWrapper>
  )
}

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
    <PasswordWrapper>
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

                    <Button disabled={!isValid} primary type="submit">
                      Change password
                    </Button>
                  </Fragment>
                )
              }}
            </Form>
          )
        }}
      </RibbonFeedback>
    </PasswordWrapper>
  )
}

const UserProfile = props => {
  const {
    data,
    loading,
    updatePassword,
    updatePersonalInformation,
    updateUsername,
  } = props

  if (loading) return <Loading />
  const { givenName, surname, username } = data

  return (
    <Wrapper>
      <Header>User Profile</Header>

      <SectionWrapper>
        <PersonalInformation
          givenName={givenName}
          surname={surname}
          update={updatePersonalInformation}
        />

        <Username update={updateUsername} username={username} />
      </SectionWrapper>
      <Separator />

      <Password update={updatePassword} />
    </Wrapper>
  )
}

export default UserProfile
