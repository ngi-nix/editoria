import React from 'react'
import { Form } from 'formik'
import { override } from '@pubsweet/ui-toolkit'
import {
  ValidatedFieldFormik,
  CenteredColumn,
  Link,
  H1,
  ErrorText,
  Button,
  TextField,
} from '@pubsweet/ui'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

const FormContainer = styled.div`
  ${override('Login.FormContainer')};
`
const SuccessText = styled.div`
  color: green;
`

const Logo = styled.div`
  ${override('Login.Logo')};
`
const validateEmail = value => {
  let error
  if (!value) {
    error = 'Required'
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      value,
    ) // https://www.w3resource.com/javascript/form/email-validation.php
  ) {
    error = 'Invalid email address'
  }
  return error
}

const validateUsername = value => {
  let error
  if (value === 'admin') {
    error = 'Nice try!'
  } else if (value === 'null') {
    error = 'This is not a valid username'
  } else if (!value) {
    error = 'Required'
  }
  return error
}

const validateNames = value => {
  let error
  if (value === 'null') {
    error = 'This is not a valid name'
  } else if (!value) {
    error = 'Required'
  }
  return error
}

const validatePassword = value => {
  let error
  if (!value) {
    error = 'Required'
  } else if (value.length < 8) {
    error = 'Password should be more than 7 characters'
  }
  return error
}
const GivenNameInput = props => (
  <TextField
    data-test-id="givenName"
    label="Given Name"
    {...props}
    placeholder="Given Name"
  />
)
const SurnameInput = props => (
  <TextField
    data-test-id="surname"
    label="Surname"
    {...props}
    placeholder="Surname"
  />
)
const UsernameInput = props => (
  <TextField
    data-test-id="username"
    label="Username"
    {...props}
    placeholder="Username"
  />
)

const EmailInput = props => (
  <TextField
    data-test-id="email"
    label="Email"
    {...props}
    placeholder="Email"
    type="email"
  />
)
const PasswordInput = props => (
  <TextField
    data-test-id="password"
    label="Password"
    {...props}
    placeholder="Password"
    type="password"
  />
)

const Signup = ({
  error,
  errors,
  touched,
  status,
  handleSubmit,
  logo = null,
}) => (
  <CenteredColumn small>
    {logo && (
      <Logo>
        <img alt="pubsweet-logo" src={`${logo}`} />
      </Logo>
    )}
    <FormContainer>
      <H1>Sign up</H1>

      {error && <ErrorText>{error}</ErrorText>}
      {status && <SuccessText>User created</SuccessText>}

      <Form onSubmit={handleSubmit}>
        <ValidatedFieldFormik
          component={GivenNameInput}
          name="givenName"
          validate={validateNames}
        />
        <ValidatedFieldFormik
          component={SurnameInput}
          name="surname"
          validate={validateNames}
        />
        <ValidatedFieldFormik
          component={UsernameInput}
          name="username"
          validate={validateUsername}
        />
        <ValidatedFieldFormik
          component={EmailInput}
          name="email"
          validate={validateEmail}
        />
        <ValidatedFieldFormik
          component={PasswordInput}
          name="password"
          validate={validatePassword}
        />
        <Button disabled={error || !isEmpty(errors)} primary type="submit">
          Sign up
        </Button>
      </Form>

      <div>
        <span>Already have an account? </span>
        <Link to="/login">Login</Link>
      </div>
    </FormContainer>
  </CenteredColumn>
)

export default Signup
