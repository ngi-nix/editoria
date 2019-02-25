import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import CurrentUserQuery from './queries/currentUser'

const mapper = { CurrentUserQuery }

const mapProps = args => ({
  currentUser: get(args.CurrentUserQuery, 'data.currentUser'),
  loading: args.CurrentUserQuery.loading,
  client: args.CurrentUserQuery.client,
})

const Composed = adopt(mapper, mapProps)

const Connected = WrappedComponent => props => (
  <Composed>
    {({ loading, currentUser, client }) => {
      if (loading) return 'Loading...'
      return (
        <WrappedComponent
          client={client}
          currentUser={currentUser}
          loading={loading}
          {...props}
        />
      )
    }}
  </Composed>
)

export default Connected
