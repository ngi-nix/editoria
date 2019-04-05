/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import BookBuilder from './BookBuilder'
import {
  getBookQuery,
  // getBookBuilderRulesQuery,
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
  // getBookBuilderRulesQuery,
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
  loadingRules: false,
  // rules: get(args.getBookBuilderRulesQuery, 'data.getBookBuilderRules'),
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
  refetchingBookBuilderRules:false,
    // args.getBookBuilderRulesQuery.networkStatus === 4 ||
    // args.getBookBuilderRulesQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history } = props
  const { id: bookId } = match.params
  const test = {
    id: '2498cb34-daf5-4f94-9ed2-cb1f07966ee4',
    canViewAddComponent: true,
    canReorderBookComponent: true,
    canViewUploadButton: true,
    canViewMultipleFilesUpload: true,
    canViewTeamManager: true,
    canViewStateList: true,
    canViewAlignmentTool: true,
    exportBook: true,
    downloadEPUB: true,
    bookComponentStateRules: [
      {
        id: 'c7250d1e-a1aa-4f2e-8408-ea382939aeb2',
        bookComponentId: 'fd83c0fa-ebea-4d77-a676-77cb051746db',
        stage: [
          {
            type: 'upload',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'file_prep',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'edit',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'review',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'clean_up',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'page_check',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'final',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
        ],
        __typename: 'BookComponentStateRule',
      },
      {
        id: '4ba9ee13-30cf-4d88-b83d-5a9609d833f5',
        bookComponentId: 'c7730922-c883-4bab-8b86-54b7158d7649',
        stage: [
          {
            type: 'upload',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'file_prep',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'edit',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'review',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'clean_up',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'page_check',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'final',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
        ],
        __typename: 'BookComponentStateRule',
      },
      {
        id: 'e8eeb355-38ea-44e4-bc75-d06d95b7fac5',
        bookComponentId: '52554908-0eee-4cd5-9a45-6c3e14fcc661',
        stage: [
          {
            type: 'upload',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'file_prep',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'edit',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'review',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'clean_up',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'page_check',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'final',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
        ],
        __typename: 'BookComponentStateRule',
      },
      {
        id: '7d284903-3882-4053-a297-90051248a52a',
        bookComponentId: '6056e0e6-ab5d-4533-90a7-2569a64498a4',
        stage: [
          {
            type: 'upload',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'file_prep',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'edit',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'review',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'clean_up',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'page_check',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'final',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
        ],
        __typename: 'BookComponentStateRule',
      },
      {
        id: '92c54ef5-3f95-45eb-a463-bfe7e6e302c2',
        bookComponentId: 'db51438f-3175-4d6e-ae32-9a2767446d1d',
        stage: [
          {
            type: 'upload',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'file_prep',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'edit',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'review',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'clean_up',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'page_check',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'final',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
        ],
        __typename: 'BookComponentStateRule',
      },
      {
        id: '512ca90d-e0d1-4be5-8d08-13c12ab49c41',
        bookComponentId: '5dd1f06d-677c-41a3-b85c-3d253fb1c59b',
        stage: [
          {
            type: 'upload',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'file_prep',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'edit',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'review',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'clean_up',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'page_check',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
          {
            type: 'final',
            canChangeProgressList: true,
            canChangeProgressListRight: true,
            canChangeProgressListLeft: true,
            __typename: 'Stages',
          },
        ],
        __typename: 'BookComponentStateRule',
      },
    ],
    __typename: 'BookBuilderRules',
  }

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
        refetchingBookBuilderRules,
      }) => {
        if (loading || loadingRules) return 'Loading...'
        console.log('book', book, rules)
        return (
          <BookBuilder
            addBookComponent={addBookComponent}
            addBookComponents={addBookComponents}
            refetching={refetching}
            refetchingBookBuilderRules={refetchingBookBuilderRules}
            book={book}
            history={history}
            exportBook={exportBook}
            deleteBookComponent={deleteBookComponent}
            ingestWordFiles={ingestWordFiles}
            loading={loading}
            loadingRules={loadingRules}
            rules={test}
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
