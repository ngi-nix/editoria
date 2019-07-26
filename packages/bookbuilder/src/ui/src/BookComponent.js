import React, { Component } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
// import { flow } from 'lodash'
// import { DragSource, DropTarget } from 'react-dnd'
import BookComponentTitle from './BookComponentTitle'
import BookComponentActions from './BookComponentActions'
import ComponentTypeMenu from './ComponetTypeMenu'
import { ButtonWithoutLabel } from './Button'
import SecondRow from './SecondRow'
import FirstRow from './FirstRow'
// import {
//   bookComponentSource,
//   bookComponentTarget,
//   collectDrag,
//   collectDrop,
//   itemTypes,
// } from '../../dnd'

const BookComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${({ shouldIndent }) => (shouldIndent ? '5%' : '0')};
  margin-bottom: calc(3 * ${th('gridUnit')});
  background-color: white;
  width:100%;
`
// const ActionsRight = styled.div`
//   display: flex;
//   align-self: flex-end;
//   align-items: flex-start;
//   justify-content: center;
// `
const ActionsLeft = styled.div`
  display: flex;
  flex-basis: 7%;
  align-items: center;
  justify-content: center;
`

const rotate = keyframes`
from { transform: rotate(0deg);}
    to {  transform: rotate(360deg); } 
`

const GrabIcon = styled.span`
  height: calc(4 * ${th('gridUnit')});
  width: calc(4 * ${th('gridUnit')});
  svg {
    height: auto;

    padding: 0;
    width: calc(4 * ${th('gridUnit')});
    #outer {
      stroke: ${th('colorBackground')};
    }
    #inner {
      fill: ${th('colorBackground')};
    }
    #drag-icon {
      fill: ${th('colorFurniture')};
    }
  }

  &:hover {
    cursor: grab;
    svg {
      #outer {
        stroke: ${th('colorBackground')};
      }
      #inner {
        fill: ${th('colorBackgroundHue')};
      }
      #drag-icon {
        fill: ${th('colorPrimary')};
      }
    }
  }
  &:active {
    cursor: grabbing;
    svg {
      #outer {
        stroke: ${th('colorPrimary')};
      }
      #inner {
        fill: ${th('colorPrimary')};
      }
      #drag-icon {
        fill: ${th('colorBackground')};
      }
    }
  }
  &:focus {
    svg {
      #outer {
        stroke: ${th('colorPrimary')};
      }
    }
  }
`

const SettingsIcon = styled.span`
  height: calc(4 * ${th('gridUnit')});
  width: calc(4 * ${th('gridUnit')});
  svg {
    height: auto;

    padding: 0;
    width: calc(4 * ${th('gridUnit')});
    #outer {
      stroke: ${th('colorBackground')};
    }
    #inner {
      fill: ${th('colorBackground')};
    }
    #icon {
      fill: ${th('colorFurniture')};
    }
  }

  &:hover {
    cursor: pointer;
    svg {
      #outer {
        stroke: ${th('colorBackground')};
      }
      #inner {
        fill: ${th('colorBackgroundHue')};
      }
      #icon {
        fill: ${th('colorPrimary')};
      }
    }
  }
  &:active {
    cursor: pointer;
    svg {
      animation: ${rotate} 0.9s ease-in-out;
      #outer {
        stroke: ${th('colorPrimary')};
      }
      #inner {
        fill: ${th('colorPrimary')};
      }
      #icon {
        fill: ${th('colorBackground')};
      }
    }
  }
  &:focus {
    svg {
      #outer {
        stroke: ${th('colorPrimary')};
      }
    }
  }
`

const BookComponent = ({
  innerRef,
  provided,
  bookId,
  onWarning,
  connectDragSource,
  connectDropTarget,
  applicationParameter,
  currentUser,
  history,
  componentType,
  componentTypeOrder,
  hasContent,
  divisionId,
  divisionType,
  id,
  updateBookComponentUploading,
  isDragging,
  lock,
  onDeleteBookComponent,
  outerContainer,
  showModal,
  showModalToggle,
  pagination,
  remove,
  rules,
  title,
  workflowStages,
  trackChangesEnabled,
  onWorkflowUpdate,
  onAdminUnlock,
  uploading,
  updatePagination,
  updateWorkflowState,
  updateBookComponentContent,
  updateComponentType,
  updateApplicationParameters,
}) => {
  const onUpdateComponentType = value => {
    updateComponentType({
      variables: {
        input: {
          id,
          componentType: value,
        },
      },
    })
  }

  const onAddComponentType = value => {
    updateApplicationParameters({
      variables: {
        input: {
          context: 'bookBuilder',
          area: 'divisions',
          config: value,
        },
      },
    })
  }

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      fill="none"
      viewBox="0 0 42 42"
    >
      <path
        id="outer"
        fill="transparent"
        strokeWidth="6"
        d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
      />
      <path
        id="inner"
        stroke="white"
        strokeWidth="3"
        d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
      />
      <g id="drag-icon">
        <path d="M19 13.5333C19 12.4288 19.8954 11.5333 21 11.5333C22.1046 11.5333 23 12.4288 23 13.5333C23 14.6379 22.1046 15.5333 21 15.5333C19.8954 15.5333 19 14.6379 19 13.5333Z" />
        <path d="M19 29C19 27.8954 19.8954 27 21 27C22.1046 27 23 27.8954 23 29C23 30.1046 22.1046 31 21 31C19.8954 31 19 30.1046 19 29Z" />
        <path d="M19 21.2667C19 20.1621 19.8954 19.2667 21 19.2667C22.1046 19.2667 23 20.1621 23 21.2667C23 22.3712 22.1046 23.2667 21 23.2667C19.8954 23.2667 19 22.3712 19 21.2667Z" />
      </g>
    </svg>
  )

  const previewIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="green"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        fill="green"
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      />
    </svg>
  )
  const goToEditor = () => {
    history.push(`/books/${bookId}/bookComponents/${id}`)
  }
  return (
    <BookComponentContainer
      // ref={instance => connectDragSource(connectDropTarget(instance))}
      shouldIndent={
        componentType === 'chapter' ||
        componentType === 'unnumbered' ||
        componentType === 'component'
      }
    >
      <FirstRow>
        <ActionsLeft lock={lock}>
          <GrabIcon {...provided.dragHandleProps}>{icon}</GrabIcon>
          <ComponentTypeMenu
            addComponentType={onAddComponentType}
            applicationParameter={applicationParameter}
            componentType={componentType}
            divisionType={divisionType}
            onChange={onUpdateComponentType}
          />
          {/* {lock && (
            <ButtonWithoutLabel onClick={goToEditor} icon={previewIcon} />
          )} */}
        </ActionsLeft>
        <BookComponentTitle
          applicationParameter={applicationParameter}
          bookComponentId={id}
          bookId={bookId}
          title={title}
          divisionType={divisionType}
          componentType={componentType}
          uploading={uploading}
          lock={lock}
          history={history}
        />
        <BookComponentActions
          currentUser={currentUser}
          outerContainer={outerContainer}
          onDeleteBookComponent={onDeleteBookComponent}
          onAdminUnlock={onAdminUnlock}
          title={title}
          goToEditor={goToEditor}
          showModal={showModal}
          showModalToggle={showModalToggle}
          uploading={uploading}
          bookComponentId={id}
          componentType={componentType}
          bookId={bookId}
          lock={lock}
          history={history}
          remove={remove}
          rules={rules}
          // update={update}
        />
      </FirstRow>

      <SecondRow
        applicationParameter={applicationParameter}
        bookComponentId={id}
        onWorkflowUpdate={onWorkflowUpdate}
        onWarning={onWarning}
        bookId={bookId}
        componentType={componentType}
        updateBookComponentContent={updateBookComponentContent}
        updateBookComponentUploading={updateBookComponentUploading}
        divisionId={divisionId}
        lock={lock}
        outerContainer={outerContainer}
        pagination={pagination}
        rules={rules}
        uploading={uploading}
        goToEditor={goToEditor}
        trackChangesEnabled={trackChangesEnabled}
        // update={update}
        updatePagination={updatePagination}
        updateWorkflowState={updateWorkflowState}
        workflowStages={workflowStages}
        showModal={showModal}
        showModalToggle={showModalToggle}
      />
    </BookComponentContainer>
  )
}

// export { BookComponent as UnwrappedBookComponent }
export default BookComponent

// export default flow(
//   DragSource(itemTypes.BOOK_COMPONENT, bookComponentSource, collectDrag),
//   DropTarget(itemTypes.BOOK_COMPONENT, bookComponentTarget, collectDrop),
// )(BookComponent)
