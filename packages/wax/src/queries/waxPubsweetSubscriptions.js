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

const CUSTOM_TAG_SUBSCRIPTION = gql`
  subscription CustomTagUpdated {
    customTagUpdated {
      id
    }
  }
`

const BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentLockUpdated($bookComponentIds: [ID]!) {
    bookComponentLockUpdated(bookComponentIds: $bookComponentIds) {
      id
    }
  }
`

const BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentOrderUpdated {
    bookComponentOrderUpdated {
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

const orderChangeSubscription = props => {
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
      subscription={BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION}
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
  if (!getBookComponentQuery.data.getBookComponent) {
    return null
  }
  const { id } = getBookComponentQuery.data.getBookComponent

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION}
      variables={{ bookComponentIds: [id] }}
    >
      {render}
    </Subscription>
  )
}

const customTagsSubscription = props => {
  const { render, getCustomTagsQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getCustomTagsQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={CUSTOM_TAG_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export {
  trackChangeSubscription,
  titleChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
  customTagsSubscription,
}
