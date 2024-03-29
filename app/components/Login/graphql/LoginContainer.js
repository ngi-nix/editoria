import { compose, withState, withHandlers } from 'recompose'
import { withFormik } from 'formik'
import { graphql } from '@apollo/react-components'
import mutations from './mutations'
import Login from '../Login'

const getNextUrl = () => {
  const url = new URL(window.location.href)
  return `${url.searchParams.get('next') || '/'}`
}

const localStorage = window.localStorage || undefined

const handleSubmit = (values, { props, setSubmitting, setErrors }) =>
  props
    .loginUser({
      variables: { input: values },
    })
    .then(({ data }) => {
      localStorage.setItem('token', data.loginUser.token)
      setTimeout(() => {
        props.onLoggedIn(getNextUrl())
      }, 100)
    })
    .catch(e => {
      if (e.graphQLErrors.length > 0) {
        setSubmitting(false)
        setErrors(e.graphQLErrors[0].message)
      }
    })

const enhancedFormik = withFormik({
  initialValues: {
    username: '',
    password: '',
  },
  mapPropsToValues: props => ({
    username: props.username,
    password: props.password,
  }),
  displayName: 'login',
  handleSubmit,
})(Login)

export default compose(
  graphql(mutations.LOGIN_USER, {
    name: 'loginUser',
  }),
  withState('redirectLink', 'loggedIn', null),
  withHandlers({
    onLoggedIn: ({ loggedIn }) => returnUrl => loggedIn(() => returnUrl),
  }),
)(enhancedFormik)
