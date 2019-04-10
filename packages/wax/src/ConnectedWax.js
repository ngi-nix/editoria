/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import WaxPubsweet from './WaxPubsweet'
import {
  getBookComponentQuery,
  getWaxRulesQuery,
  getCurrentUserQuery,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  renameBookComponentMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  trackChangeSubscription,
  titleChangeSubscription,
} from './queries'

const mapper = {
  getBookComponentQuery,
  getWaxRulesQuery,
  getCurrentUserQuery,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  renameBookComponentMutation,
  // trackChangeSubscription,
  // titleChangeSubscription,
}

const mapProps = args => ({
  rules: get(args.getWaxRulesQuery, 'data.getWaxRules'),
  bookComponent: get(args.getBookComponentQuery, 'data.getBookComponent'),
  user: get(args.getCurrentUserQuery, 'data.currentUser'),
  subscribeToMore: get(args.getBookComponentQuery, 'subscribeToMore'),
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentTrackChanges:
    args.updateBookComponentTrackChangesMutation.updateTrackChanges,
  uploadFile: args.uploadFileMutation.uploadFile,
  renameBookComponent: args.renameBookComponentMutation.renameBookComponent,
  lockBookComponent: args.lockBookComponentMutation.lockBookComponent,
  unlockBookComponent: args.unlockBookComponentMutation.unlockBookComponent,

  loading: args.getBookComponentQuery.networkStatus === 1,
  waxLoading: args.getWaxRulesQuery.networkStatus === 1,
  userLoading: args.getCurrentUserQuery.networkStatus === 1,
  refetching:
    args.getBookComponentQuery.networkStatus === 4 ||
    args.getBookComponentQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, config } = props
  const { bookId, bookComponentId } = match.params

  return (
    <Composed bookComponentId={bookComponentId} bookId={bookId}>
      {({
        bookComponent,
        rules,
        user,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        lockBookComponent,
        unlockBookComponent,
        renameBookComponent,
        loading,
        waxLoading,
        userLoading,
      }) => {
        return (
          <WaxPubsweet
            bookComponent={bookComponent}
            bookComponentId={bookComponentId}
            waxLoading={waxLoading}
            config={config}
            history={history}
            loading={loading}
            userLoading={userLoading}
            lockBookComponent={lockBookComponent}
            renameBookComponent={renameBookComponent}
            rules={rules}
            user={user}
            unlockBookComponent={unlockBookComponent}
            updateBookComponentContent={updateBookComponentContent}
            updateBookComponentTrackChanges={updateBookComponentTrackChanges}
            uploadFile={uploadFile}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
