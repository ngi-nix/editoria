import gql from 'graphql-tag'

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

export {
  BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
}
