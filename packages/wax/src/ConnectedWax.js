/* eslint-disable no-console */

import React from 'react'
import { get, find, findIndex, difference, forEach } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import WaxPubsweet from './WaxPubsweet'
import {
  getBookComponentQuery,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  renameBookComponentMutation,
  uploadFileMutation,
} from './queries'

import {
  BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
} from './queries/waxPubsweetSubscriptions'

const mapper = {
  getBookComponentQuery,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  uploadFileMutation,
  renameBookComponentMutation,
}

const mapProps = args => ({
  bookComponent: get(args.getBookComponentQuery, 'data.getBookComponent'),
  subscribeToMore: get(args.getBookComponentQuery, 'subscribeToMore'),
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentTrackChanges:
    args.updateBookComponentTrackChangesMutation.updateTrackChanges,
  uploadFile: args.uploadFileMutation.uploadFile,
  renameBookComponent: args.renameBookComponentMutation.renameBookComponent,
  loading: args.getBookComponentQuery.loading,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, config } = props
  const { bookId, bookComponentId } = match.params

  return (
    <Composed bookComponentId={bookComponentId} bookId={bookId}>
      {({
        bookComponent,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        renameBookComponent,
        subscribeToMore,
        loading,
      }) => {
        if (loading) return 'Loading...'
        return (
          <WaxPubsweet
            bookComponent={bookComponent}
            config={config}
            history={history}
            loading={loading}
            updateBookComponentContent={updateBookComponentContent}
            updateBookComponentTrackChanges={updateBookComponentTrackChanges}
            uploadFile={uploadFile}
            renameBookComponent={renameBookComponent}
            subscribeToTrackChangesUpdated={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (prev.getBookComponent.id !== subscriptionData.data.id)
                    return prev

                  const copy = Object.assign({}, prev)
                  copy.getBookComponent.trackChangesEnabled =
                    subscriptionData.data.bookComponentTrackChangesUpdated.trackChangesEnabled
                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToTitleUpdated={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (prev.getBookComponent.id !== subscriptionData.data.id)
                    return prev

                  const copy = Object.assign({}, prev)
                  copy.getBookComponent.title =
                    subscriptionData.data.bookComponentTitleUpdated.title
                  return Object.assign({}, prev, copy)
                },
              })
            }
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
