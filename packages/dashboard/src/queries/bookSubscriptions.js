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
const BOOK_RENAMED_SUBSCRIPTION = gql`
  subscription BookRenamed {
    bookRenamed {
      id
      title
      collectionId
    }
  }
`
const BOOK_DELETED_SUBSCRIPTION = gql`
  subscription BookDeleted {
    bookDeleted {
      id
      collectionId
    }
  }
`

// export {
//   BOOK_CREATED_SUBSCRIPTION,
//   BOOK_RENAMED_SUBSCRIPTION,
//   BOOK_DELETED_SUBSCRIPTION,
// }

// import React from 'react'
// import { Subscription } from 'react-apollo'
// import gql from 'graphql-tag'

const bookSubscriptions = props => {
  const { render } = props

  return (
    <Subscription subscription={BOOK_CREATED_SUBSCRIPTION}>
      {({ data, loading }) => render({ data, loading })}
    </Subscription>
  )
}

export default bookSubscriptions
