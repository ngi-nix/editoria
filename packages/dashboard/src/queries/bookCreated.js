import React from 'react'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { find } from 'lodash'

import { GET_BOOK_COLLECTIONS } from './getBookCollections'

const BOOK_CREATED_SUBSCRIPTION = gql`
  subscription BookCreated {
    bookCreated {
      id
      title
      collectionId
    }
  }
`

const updateCollection = ({ client, subscriptionData }) => {
  const { bookCreated } = subscriptionData.data

  const cachedCollections = client.cache.readQuery({
    query: GET_BOOK_COLLECTIONS,
  })

  const found = find(cachedCollections.getBookCollections, [
    'id',
    bookCreated.collectionId,
  ])
  if (found) {
    found.books.push(bookCreated)
    const updatedCollection = Object.assign({}, found)

    client.cache.writeData(updatedCollection)
  }
}

const bookCreatedSubscription = props => {
  const { render } = props

  return (
    <Subscription
      onSubscriptionData={updateCollection}
      subscription={BOOK_CREATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export default bookCreatedSubscription
