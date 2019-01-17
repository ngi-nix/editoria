/* eslint-disable no-console */

import React from 'react'
import { get, find, findIndex, difference, forEach, map } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import BookBuilder from './BookBuilder'
import {
  getBookQuery,
  createBookComponentMutation,
  deleteBookComponentMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
} from './queries'

import {
  BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_ADDED_SUBSCRIPTION,
  BOOK_COMPONENT_DELETED_SUBSCRIPTION,
  BOOK_COMPONENT_PAGINATION_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
  PRODUCTION_EDITORS_UPDATED_SUBSCRIPTION,
} from './queries/bookBuilderSubscriptions'

const mapper = {
  getBookQuery,
  createBookComponentMutation,
  deleteBookComponentMutation,
  updateBookComponentPaginationMutation,
  updatedBookComponentOrderMutation,
  updateBookComponentWorkflowStateMutation,
}

const mapProps = args => ({
  book: get(args.getBookQuery, 'data.getBook'),
  subscribeToMore: get(args.getBookQuery, 'subscribeToMore'),
  addBookComponent: args.createBookComponentMutation.addBookComponent,
  deleteBookComponent: args.deleteBookComponentMutation.deleteBookComponent,
  updateBookComponentPagination:
    args.updateBookComponentPaginationMutation.updateBookComponentPagination,
  updateBookComponentOrder:
    args.updatedBookComponentOrderMutation.updateBookComponentOrder,
  updateBookComponentWorkflowState:
    args.updateBookComponentWorkflowStateMutation
      .updateBookComponentWorkflowState,
  loading: args.getBookQuery.loading,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match } = props
  const { id: bookId } = match.params

  return (
    <Composed bookId={bookId}>
      {({
        book,
        addBookComponent,
        deleteBookComponent,
        updateBookComponentPagination,
        updateBookComponentOrder,
        updateBookComponentWorkflowState,
        loading,
        subscribeToMore,
      }) => {
        if (loading) return 'Loading...'
        console.log('book', book)
        return (
          <BookBuilder
            addBookComponent={addBookComponent}
            book={book}
            deleteBookComponent={deleteBookComponent}
            loading={loading}
            updateBookComponentOrder={updateBookComponentOrder}
            updateBookComponentPagination={updateBookComponentPagination}
            updateBookComponentWorkflowState={updateBookComponentWorkflowState}
            subscribeToBookComponentOrderUpdated={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const { bookComponentOrderUpdated } = subscriptionData.data
                  if (prev.getBook.id !== bookComponentOrderUpdated.id) {
                    return prev
                  }
                  const copy = Object.assign({}, prev)
                  copy.getBook.divisions = bookComponentOrderUpdated.divisions
                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToBookComponentAdded={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_ADDED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const copy = Object.assign({}, prev)
                  const { getBook } = copy
                  const { divisions } = getBook
                  const { bookComponentAdded } = subscriptionData.data
                  if (getBook.id !== bookComponentAdded.bookId) return prev

                  const divisionIndex = findIndex(divisions, {
                    id: bookComponentAdded.divisionId,
                  })
                  copy.getBook.divisions[divisionIndex].bookComponents.push(
                    bookComponentAdded,
                  )

                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToBookComponentDeleted={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_DELETED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const copy = Object.assign({}, prev)
                  const { getBook } = copy
                  const { divisions } = getBook
                  const { bookComponentDeleted } = subscriptionData.data
                  if (getBook.id !== bookComponentDeleted.bookId) return prev

                  const divisionIndex = findIndex(divisions, {
                    id: bookComponentDeleted.divisionId,
                  })
                  const bookComponentIndex = findIndex(
                    copy.getBook.divisions[divisionIndex].bookComponents,
                    {
                      id: bookComponentDeleted.id,
                    },
                  )
                  copy.getBook.divisions[divisionIndex].bookComponents.splice(
                    bookComponentIndex,
                    1,
                  )

                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToBookComponentPaginationUpdated={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_PAGINATION_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const copy = Object.assign({}, prev)
                  const { getBook } = copy
                  const { divisions } = getBook
                  const {
                    bookComponentPaginationUpdated,
                  } = subscriptionData.data
                  if (getBook.id !== bookComponentPaginationUpdated.bookId)
                    return prev

                  const divisionIndex = findIndex(divisions, {
                    id: bookComponentPaginationUpdated.divisionId,
                  })
                  const bookComponentIndex = findIndex(
                    copy.getBook.divisions[divisionIndex].bookComponents,
                    {
                      id: bookComponentPaginationUpdated.id,
                    },
                  )
                  copy.getBook.divisions[divisionIndex].bookComponents[
                    bookComponentIndex
                  ] = bookComponentPaginationUpdated

                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToBookComponentWorkflowUpdated={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const copy = Object.assign({}, prev)
                  const { getBook } = copy
                  const { divisions } = getBook
                  const { bookComponentWorkflowUpdated } = subscriptionData.data

                  if (getBook.id !== bookComponentWorkflowUpdated.bookId)
                    return prev

                  const divisionIndex = findIndex(divisions, {
                    id: bookComponentWorkflowUpdated.divisionId,
                  })
                  const bookComponentIndex = findIndex(
                    copy.getBook.divisions[divisionIndex].bookComponents,
                    {
                      id: bookComponentWorkflowUpdated.id,
                    },
                  )
                  copy.getBook.divisions[divisionIndex].bookComponents[
                    bookComponentIndex
                  ] = bookComponentWorkflowUpdated

                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToBookComponentTitleUpdated={() =>
              subscribeToMore({
                document: BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  const copy = Object.assign({}, prev)
                  const { getBook } = copy
                  const { divisions } = getBook
                  const { bookComponentTitleUpdated } = subscriptionData.data

                  if (getBook.id !== bookComponentTitleUpdated.bookId)
                    return prev

                  const divisionIndex = findIndex(divisions, {
                    id: bookComponentTitleUpdated.divisionId,
                  })
                  const bookComponentIndex = findIndex(
                    copy.getBook.divisions[divisionIndex].bookComponents,
                    {
                      id: bookComponentTitleUpdated.id,
                    },
                  )
                  copy.getBook.divisions[divisionIndex].bookComponents[
                    bookComponentIndex
                  ].title = bookComponentTitleUpdated.title

                  return Object.assign({}, prev, copy)
                },
              })
            }
            subscribeToBookTeamMembersUpdated={() =>
              subscribeToMore({
                document: PRODUCTION_EDITORS_UPDATED_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  console.log('team', prev)
                  console.log('team2', subscriptionData)
                  const { productionEditorsUpdated } = subscriptionData.data
                  const { getBook } = prev
                  if (getBook.id === productionEditorsUpdated.bookId) {
                    if (
                      productionEditorsUpdated.teamType === 'productionEditor'
                    ) {
                      const copy = Object.assign({}, prev)

                      copy.getBook.productionEditors = map(
                        productionEditorsUpdated.members,
                        member => member.username,
                      )
                      return Object.assign({}, prev, copy)
                    }
                  }
                  return prev
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
