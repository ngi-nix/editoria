import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import Dashboard from './Dashboard'
import {
  archiveBookMutation,
  createBookMutation,
  getBookCollectionsQuery,
  getDashboardRulesQuery,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
  addTeamMemberSubscription,
} from './queries'

const mapper = {
  getBookCollectionsQuery,
  archiveBookMutation,
  getDashboardRulesQuery,
  createBookMutation,
  renameBookMutation,
  deleteBookMutation,
  bookCreatedSubscription,
  bookRenamedSubscription,
  bookDeletedSubscription,
  bookArchivedSubscription,
  addTeamMemberSubscription,
}

const mapProps = args => ({
  collections: get(args.getBookCollectionsQuery, 'data.getBookCollections'),
  createBook: args.createBookMutation.createBook,
  archiveBook: args.archiveBookMutation.archiveBook,
  deleteBook: args.deleteBookMutation.deleteBook,
  loading: args.getBookCollectionsQuery.networkStatus === 1,
  onChangeSort: args.getBookCollectionsQuery.refetch,
  refetching:
    args.getBookCollectionsQuery.networkStatus === 4 ||
    args.getBookCollectionsQuery.networkStatus === 2, // possible apollo bug
  renameBook: args.renameBookMutation.renameBook,
  loadingRules: args.getDashboardRulesQuery.loading,
  rules: get(args.getDashboardRulesQuery, 'data.getDashBoardRules'),
})

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      archiveBook,
      collections,
      createBook,
      rules,
      loadingRules,
      renameBook,
      deleteBook,
      onChangeSort,
      refetching,
      loading,
    }) => {
      if (loading || loadingRules) return 'Loading...'

      return (
        <Dashboard
          archiveBook={archiveBook}
          collections={collections}
          createBook={createBook}
          deleteBook={deleteBook}
          loading={loading}
          onChangeSort={onChangeSort}
          refetching={refetching}
          renameBook={renameBook}
          rules={rules}
        />
      )
    }}
  </Composed>
)

export default Connected
