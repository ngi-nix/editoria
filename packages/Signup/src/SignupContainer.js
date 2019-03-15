import { compose } from 'recompose'
import { withFormik } from 'formik'
import { graphql } from 'react-apollo'
import { SIGNUP_USER } from './graphql/mutations'

import Signup from './Signup'

const handleSubmit = (
  values,
  { props, setSubmitting, setErrors, setError, setStatus },
) => {
  const { signupUser } = props
  signupUser({
    variables: { input: values },
  })
    .then(res => {
      setStatus('ok')
    })
    .catch(res => {
      if (res.graphQLErrors) {
        const errors = res.graphQLErrors.map(error => {
          return error.message
        })
        setError(errors[0])
      }
    })
}

const validate = values => {
  const errors = {}

  if (values.givenName === values.surname) {
    errors.givenName = 'First name and given name are the same'
    errors.surname = 'First name and given name are the same'
  }
  if (Object.keys(errors).length) {
    return errors
  }
  return true
}

const enhancedFormik = withFormik({
  initialValues: {
    givenName: '',
    surname: '',
    username: '',
    email: '',
    password: '',
  },
  mapPropsToValues: props => ({
    givenName: props.givenName,
    surname: props.surname,
    username: props.username,
    password: props.password,
    email: props.email,
  }),
  validate,
  displayName: 'signup',
  handleSubmit,
})(Signup)

export default compose(
  graphql(SIGNUP_USER, {
    name: 'signupUser',
  }),
)(enhancedFormik)
