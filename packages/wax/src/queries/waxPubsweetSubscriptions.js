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
  const { render, getBookComponentQuery } = props
  const { refetch } = getBookComponentQuery
  const triggerRefetch = () => {
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
  const { render, getBookComponentQuery } = props
  const { refetch } = getBookComponentQuery
  const triggerRefetch = () => {
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
export { trackChangeSubscription, titleChangeSubscription }
