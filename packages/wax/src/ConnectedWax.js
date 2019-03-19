/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import WaxPubsweet from './WaxPubsweet'
import {
  getBookComponentQuery,
  getWaxRulesQuery,
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
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  renameBookComponentMutation,
  trackChangeSubscription,
  titleChangeSubscription,
}

const mapProps = args => ({
  rules: get(args.getWaxRulesQuery, 'data.getWaxRules'),
  bookComponent: get(args.getBookComponentQuery, 'data.getBookComponent'),
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
  waxLoading: args.getWaxRulesQuery.loading,
  refetching:
    args.getBookComponentQuery.networkStatus === 4 ||
    args.getBookComponentQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, config } = props
  const { bookId, bookComponentId } = match.params
  console.log('props', props)

  return (
    <Composed bookComponentId={bookComponentId} bookId={bookId}>
      {({
        bookComponent,
        rules,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        lockBookComponent,
        unlockBookComponent,
        renameBookComponent,
        loading,
        waxLoading,
      }) => {
        if (loading || waxLoading) return 'Loading...'

        return (
          <WaxPubsweet
            bookComponent={bookComponent}
            bookComponentId={bookComponentId}
            config={config}
            history={history}
            loading={loading}
            lockBookComponent={lockBookComponent}
            renameBookComponent={renameBookComponent}
            rules={rules}
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
