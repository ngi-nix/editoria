import React from 'react'
import { Query } from 'react-apollo'
import { cloneDeep, find, findIndex } from 'lodash'
import gql from 'graphql-tag'
import SubscribedComponent from './SubscribedComponent'

const GET_BOOK_COLLECTIONS = gql`
  query GetBookCollections(
    $ascending: Boolean = true
    $sortKey: String = "title"
  ) {
    getBookCollections {
      id
      title
      books(ascending: $ascending, sortKey: $sortKey) {
        id
        title
        publicationDate
        authors {
          username
        }
      }
    }
  }
`

const BOOK_CREATED_SUBSCRIPTION = gql`
  subscription BookCreated {
    bookCreated {
      id
      collectionId
      title
      publicationDate
      authors {
        username
      }
    }
  }
`

const getBookCollectionsQuery = props => {
  const { render } = props

  return (
    <Query
      fetchPolicy="cache-first"
      notifyOnNetworkStatusChange
      query={GET_BOOK_COLLECTIONS}
    >
      {({ subscribeToMore, ...result }) => {
        console.log('result', result)
        return (
          <SubscribedComponent
            {...result}
            render={render}
            subscribeToNewBooks={() =>
              subscribeToMore({
                document: BOOK_CREATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev
                  const newBook = subscriptionData.data.bookCreated
                  const deepCopy = cloneDeep(prev)
                  const { getBookCollections } = deepCopy
                  const collection = find(getBookCollections, {
                    id: newBook.collectionId,
                  })
                  if (collection) {
                    const book = find(collection.books, { id: newBook.id })
                    if (!book) {
                      collection.books.push(newBook)
                      console.log('prev', prev)
                      console.log('updated', deepCopy)
                      return Object.assign({}, prev, deepCopy)
                    }
                    return prev
                  }
                  return prev
                  // console.log('wha', deepCopy)

                  // return prev

                  // return Object.assign({}, prev, {
                  //   getBookCollections: {
                  //     0: {
                  //       books: [newBook, ...prev.getBookCollections[0].books],
                  //     },
                  //   },
                  // })
                },
              })
            }
          />
        )
      }}
    </Query>
  )
}

export { GET_BOOK_COLLECTIONS }
export default getBookCollectionsQuery
