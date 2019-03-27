/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import BookBuilder from './BookBuilder'
import {
  getBookQuery,
  getBookBuilderRulesQuery,
  createBookComponentMutation,
  createBookComponentsMutation,
  deleteBookComponentMutation,
  ingestWordFilesMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentContentMutation,
  updateBookComponentUploadingMutation,
  updateBookComponentTypeMutation,
  exportBookMutation,
  orderChangeSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  lockChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
  addTeamMemberSubscription,
  bookComponentWorkflowUpdated,
} from './queries'

const mapper = {
  getBookQuery,
  getBookBuilderRulesQuery,
  createBookComponentMutation,
  createBookComponentsMutation,
  deleteBookComponentMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
  updateBookComponentContentMutation,
  updateBookComponentUploadingMutation,
  ingestWordFilesMutation,
  updateBookComponentTypeMutation,
  exportBookMutation,
  lockChangeSubscription,
  orderChangeSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  titleChangeSubscription,
  productionEditorChangeSubscription,
  componentTypeChangeSubscription,
  addTeamMemberSubscription,
  bookComponentWorkflowUpdated,
}

const mapProps = args => ({
  book: get(args.getBookQuery, 'data.getBook'),
  addBookComponent: args.createBookComponentMutation.addBookComponent,
  addBookComponents: args.createBookComponentsMutation.addBookComponents,
  deleteBookComponent: args.deleteBookComponentMutation.deleteBookComponent,
  updateBookComponentPagination:
    args.updateBookComponentPaginationMutation.updateBookComponentPagination,
  updateBookComponentOrder:
    args.updatedBookComponentOrderMutation.updateBookComponentOrder,
  updateBookComponentWorkflowState:
    args.updateBookComponentWorkflowStateMutation
      .updateBookComponentWorkflowState,
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentUploading:
    args.updateBookComponentUploadingMutation.updateUploading,
  updateComponentType: args.updateBookComponentTypeMutation.updateComponentType,
  ingestWordFiles: args.ingestWordFilesMutation.ingestWordFiles,
  exportBook: args.exportBookMutation.exportBook,
  loading: args.getBookQuery.networkStatus === 1,
  loadingRules: args.getBookBuilderRulesQuery.loading,
  rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history } = props
  const { id: bookId } = match.params

  return (
    <Composed bookId={bookId}>
      {({
        book,
        addBookComponent,
        addBookComponents,
        deleteBookComponent,
        updateBookComponentPagination,
        updateBookComponentOrder,
        updateComponentType,
        updateBookComponentWorkflowState,
        updateBookComponentContent,
        updateBookComponentUploading,
        ingestWordFiles,
        loading,
        loadingRules,
        exportBook,
        rules,
        refetching,
      }) => {
        if (loading || loadingRules) return 'Loading...'
        console.log('book', book, rules)
        return (
          <BookBuilder
            addBookComponent={addBookComponent}
            addBookComponents={addBookComponents}
            refetching={refetching}
            book={book}
            history={history}
            exportBook={exportBook}
            deleteBookComponent={deleteBookComponent}
            ingestWordFiles={ingestWordFiles}
            loading={loading}
            rules={rules}
            updateBookComponentContent={updateBookComponentContent}
            updateComponentType={updateComponentType}
            updateBookComponentOrder={updateBookComponentOrder}
            updateBookComponentPagination={updateBookComponentPagination}
            updateBookComponentUploading={updateBookComponentUploading}
            updateBookComponentWorkflowState={updateBookComponentWorkflowState}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
