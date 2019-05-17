import gql from 'graphql-tag'
import React from 'react'
import { Subscription } from 'react-apollo'

const BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentTrackChangesUpdated {
    bookComponentTrackChangesUpdated {
      id
      trackChangesEnabled
    }
  }
`

const BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentLockUpdated {
    bookComponentLockUpdated {
      id
    }
  }
`
const BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentTitleUpdated {
    bookComponentTitleUpdated {
      title
      bookId
      id
      divisionId
    }
  }
`

const trackChangeSubscription = props => {
  const { render, getBookComponentQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookComponentQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const titleChangeSubscription = props => {
  const { render, getBookComponentQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookComponentQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const lockChangeSubscription = props => {
  const { render, getBookComponentQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookComponentQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
export {
  trackChangeSubscription,
  titleChangeSubscription,
  lockChangeSubscription,
}
