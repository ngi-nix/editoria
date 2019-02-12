import React, { Component } from 'react'
import config from 'config'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { flow } from 'lodash'
import { DragSource, DropTarget } from 'react-dnd'
import { DefaultButton } from './Button'
// import FirstRow from '../../Chapter/FirstRow'
// import SecondRow from '../../Chapter/SecondRow'
import BookComponentTitle from './BookComponentTitle'
// import BookComponentActions from './BookComponentActions'

import {
  bookComponentSource,
  bookComponentTarget,
  collectDrag,
  collectDrop,
  itemTypes,
} from '../../dnd'

const BookComponentContainer = styled.li`
  display: flex;
  flex-direction: column;
`
const Actions = styled.div`
  display: flex;
  align-self: flex-end;
`
const FirstRow = styled.div`
  display: flex;
`
const SecondRow = styled.div`
  display: flex;
  align-items: flex-start;
`
const Grab = styled.span`
  align-self: flex-start;
`
const BookComponent = ({
  bookId,
  connectDragSource,
  connectDropTarget,
  componentType,
  componentTypeOrder,
  hasContent,
  divisionId,
  divisionType,
  id,
  updateBookComponentUploading,
  isDragging,
  lock,
  outerContainer,
  pagination,
  remove,
  title,
  workflowStages,
  trackChangesEnabled,
  uploading,
  updatePagination,
  updateWorkflowState,
  updateBookComponentContent,
  user,
}) => {
  const update = () => {}
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 40 40"
    >
      <path
        id="outer"
        fill="none"
        stroke="var(--icon-stroke)"
        stroke-width="6"
        d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
      />
      <path
        id="inner"
        fill="none"
        stroke="white"
        stroke-width="3"
        d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
      />
      <g id="drag-icon">
        <path
          fill="black"
          d="M19 13.5333C19 12.4288 19.8954 11.5333 21 11.5333C22.1046 11.5333 23 12.4288 23 13.5333C23 14.6379 22.1046 15.5333 21 15.5333C19.8954 15.5333 19 14.6379 19 13.5333Z"
          class="circle"
        />
        <path
          fill="black"
          d="M19 29C19 27.8954 19.8954 27 21 27C22.1046 27 23 27.8954 23 29C23 30.1046 22.1046 31 21 31C19.8954 31 19 30.1046 19 29Z"
          class="circle"
        />
        <path
          fill="black"
          d="M19 21.2667C19 20.1621 19.8954 19.2667 21 19.2667C22.1046 19.2667 23 20.1621 23 21.2667C23 22.3712 22.1046 23.2667 21 23.2667C19.8954 23.2667 19 22.3712 19 21.2667Z"
          class="circle"
        />
      </g>
    </svg>
  )
  return (
    <BookComponentContainer
      ref={instance => connectDragSource(connectDropTarget(instance))}
    >
      <FirstRow>
        <Grab>{icon}</Grab> 
        <BookComponentTitle />
        <Actions>
          <DefaultButton label="edit" />
          <DefaultButton label="remove" />
          <DefaultButton label="view" />
        </Actions>
      </FirstRow>
      <SecondRow />
    </BookComponentContainer>
  )
}

export { BookComponent as UnwrappedBookComponent }

export default flow(
  DragSource(itemTypes.BOOK_COMPONENT, bookComponentSource, collectDrag),
  DropTarget(itemTypes.BOOK_COMPONENT, bookComponentTarget, collectDrop),
)(BookComponent)

/* <FirstRow
        bookComponentId={id}
        bookId={bookId}
        componentType={componentType}
        componentTypeOrder={componentTypeOrder}
        divisionType={divisionType}
        lock={lock}
        outerContainer={outerContainer}
        remove={remove}
        title={title}
        update={update}
        uploading={uploading}
        user={user}
      /> */

/* <SecondRow
        bookComponentId={id}
        bookId={bookId}
        componentType={componentType}
        updateBookComponentContent={updateBookComponentContent}
        updateBookComponentUploading={updateBookComponentUploading}
        divisionId={divisionId}
        outerContainer={outerContainer}
        pagination={pagination}
        uploading={uploading}
        trackChangesEnabled={trackChangesEnabled}
        update={update}
        updatePagination={updatePagination}
        updateWorkflowState={updateWorkflowState}
        viewOrEdit={true}
        workflowStages={workflowStages}
      /> */
