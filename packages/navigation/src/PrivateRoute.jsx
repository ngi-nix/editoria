import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import Connected from './ConnectedNavigation'

const PrivateRoute = ({
  currentUser,
  config,
  component: Component,
  ...rest
}) => (
  <Route
    render={props => {
      if (currentUser) {
        return (
          <Component {...props} config={config} currentUser={currentUser} />
        )
      }

      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }}
    {...rest}
  />
)

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired, // eslint-disable-line
}

const ConnectedPrivateRoute = Connected(PrivateRoute)
export default compose(withRouter)(ConnectedPrivateRoute)
