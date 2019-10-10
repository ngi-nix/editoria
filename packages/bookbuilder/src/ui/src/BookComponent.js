import React from 'react'
import styled, { keyframes } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
// import { flow } from 'lodash'
// import { DragSource, DropTarget } from 'react-dnd'
import BookComponentTitle from './BookComponentTitle'
import BookComponentActions from './BookComponentActions'
import ComponentTypeMenu from './ComponetTypeMenu'
import SecondRow from './SecondRow'
import FirstRow from './FirstRow'
import { ButtonWithoutLabel } from './Button'
// import {
//   bookComponentSource,
//   bookComponentTarget,
//   collectDrag,
//   collectDrop,
//   itemTypes,
// } from '../../dnd'

const StyledButton = styled(ButtonWithoutLabel)`
  svg {
    #Line {
      visibility: ${({ includeInTOC }) =>
        includeInTOC ? 'visible' : 'hidden'};
    }
    #Line_2 {
      visibility: ${({ includeInTOC }) =>
        includeInTOC ? 'visible' : 'hidden'};
    }
  }

  &:hover {
    #Line {
      stroke: ${({ includeInTOC }) => (includeInTOC ? th('colorPrimary') : '')};
    }
    #Line_2 {
      stroke: ${({ includeInTOC }) => (includeInTOC ? 'white' : '')};
    }
  }
`
const BookComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: ${({ shouldIndent, componentType }) => {
    if (shouldIndent) {
      if (componentType !== 'toc') {
        return '5%'
      }
      return '3%'
    }
    return '0'
  }};
  margin-bottom: calc(3 * ${th('gridUnit')});
  background-color: white;
  width: 100%;
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
  includeInTOC,
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
  pagination,
  remove,
  rules,
  title,
  toggleIncludeInTOC,
  workflowStages,
  trackChangesEnabled,
  onWorkflowUpdate,
  onAdminUnlock,
  uploading,
  uploadBookComponent,
  updatePagination,
  updateWorkflowState,
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

  const onToggleIncludeInTOC = id => {
    toggleIncludeInTOC({
      variables: {
        input: {
          id,
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
      fill="none"
      height="42"
      viewBox="0 0 42 42"
      width="42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
        fill="transparent"
        id="outer"
        strokeWidth="6"
      />
      <path
        d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
        id="inner"
        stroke="white"
        strokeWidth="3"
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
      fill="green"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        fill="green"
      />
    </svg>
  )

  const tocIcon = (
    <svg
      width="38"
      height="22"
      viewBox="0 0 38 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="TOC-icon">
        <path
          id="TOC"
          d="M11.1014 4.616L10.9034 5.984H7.86142V17H6.18742V5.984H3.05542V4.616H11.1014ZM16.2086 4.382C17.6846 4.382 18.8426 4.928 19.6826 6.02C20.5346 7.1 20.9606 8.696 20.9606 10.808C20.9606 12.884 20.5406 14.474 19.7006 15.578C18.8606 16.682 17.6966 17.234 16.2086 17.234C14.7326 17.234 13.5686 16.694 12.7166 15.614C11.8766 14.522 11.4566 12.926 11.4566 10.826C11.4566 9.446 11.6486 8.276 12.0326 7.316C12.4286 6.344 12.9806 5.612 13.6886 5.12C14.4086 4.628 15.2486 4.382 16.2086 4.382ZM16.2086 5.714C14.2166 5.714 13.2206 7.418 13.2206 10.826C13.2206 14.198 14.2166 15.884 16.2086 15.884C17.1926 15.884 17.9366 15.482 18.4406 14.678C18.9446 13.874 19.1966 12.584 19.1966 10.808C19.1966 9.044 18.9386 7.754 18.4226 6.938C17.9186 6.122 17.1806 5.714 16.2086 5.714ZM27.4934 4.382C28.1414 4.382 28.7054 4.484 29.1854 4.688C29.6654 4.88 30.1394 5.186 30.6074 5.606L29.7434 6.614C29.3954 6.314 29.0474 6.092 28.6994 5.948C28.3634 5.804 27.9914 5.732 27.5834 5.732C26.6474 5.732 25.9034 6.134 25.3514 6.938C24.7994 7.73 24.5234 9.014 24.5234 10.79C24.5234 12.518 24.7994 13.796 25.3514 14.624C25.9034 15.44 26.6474 15.848 27.5834 15.848C28.0514 15.848 28.4534 15.764 28.7894 15.596C29.1254 15.428 29.4914 15.182 29.8874 14.858L30.7334 15.848C29.8334 16.772 28.7534 17.234 27.4934 17.234C26.5694 17.234 25.7474 16.994 25.0274 16.514C24.3194 16.034 23.7614 15.314 23.3534 14.354C22.9574 13.382 22.7594 12.194 22.7594 10.79C22.7594 9.398 22.9634 8.222 23.3714 7.262C23.7914 6.302 24.3554 5.582 25.0634 5.102C25.7834 4.622 26.5934 4.382 27.4934 4.382Z"
          fill="#BDBDBD"
        />
        <line
          id="Line"
          y1="-1"
          x2="29.7664"
          y2="-1"
          transform="matrix(0.984144 -0.177373 0.0507775 0.99871 3.17969 14.5656)"
          stroke="#BDBDBD"
          strokeWidth="2"
        />
        <line
          id="Line_2"
          y1="-1"
          x2="34.7275"
          y2="-1"
          transform="matrix(0.984144 -0.177373 0.0507775 0.99871 3 16.1597)"
          stroke="white"
          strokeWidth="2"
        />
      </g>
    </svg>
  )
  const goToEditor = () => {
    history.push(`/books/${bookId}/bookComponents/${id}`)
  }
  return (
    <BookComponentContainer
      componentType={componentType}
      // ref={instance => connectDragSource(connectDropTarget(instance))}
      shouldIndent={
        // componentType === 'chapter' ||
        // componentType === 'unnumbered' ||
        // componentType === 'component'
        componentType !== 'part'
      }
    >
      <FirstRow>
        <ActionsLeft lock={lock}>
          <GrabIcon {...provided.dragHandleProps}>{icon}</GrabIcon>
          {componentType !== 'toc' && componentType !== 'endnotes' && (
            <ComponentTypeMenu
              addComponentType={onAddComponentType}
              applicationParameter={applicationParameter}
              componentType={componentType}
              divisionType={divisionType}
              onChange={onUpdateComponentType}
            />
          )}
          {/* {lock && (
            <ButtonWithoutLabel onClick={goToEditor} icon={previewIcon} />
          )} */}
        </ActionsLeft>
        <StyledButton
          icon={tocIcon}
          includeInTOC={includeInTOC}
          onClick={e => {
            e.preventDefault()
            onToggleIncludeInTOC(id)
          }}
        />
        <BookComponentTitle
          applicationParameter={applicationParameter}
          bookComponentId={id}
          bookId={bookId}
          componentType={componentType}
          divisionType={divisionType}
          history={history}
          lock={lock}
          title={title}
          goToEditor={goToEditor}
          showModal={showModal}
          uploading={uploading}
        />
        <BookComponentActions
          bookComponentId={id}
          bookId={bookId}
          componentType={componentType}
          currentUser={currentUser}
          goToEditor={goToEditor}
          history={history}
          lock={lock}
          onAdminUnlock={onAdminUnlock}
          onDeleteBookComponent={onDeleteBookComponent}
          outerContainer={outerContainer}
          remove={remove}
          rules={rules}
          showModal={showModal}
          showModalToggle={showModalToggle}
          title={title}
          uploading={uploading}
          // update={update}
        />
      </FirstRow>

      {componentType !== 'toc' && componentType !== 'endnotes' && (
        <SecondRow
          applicationParameter={applicationParameter}
          bookComponentId={id}
          bookId={bookId}
          componentType={componentType}
          updateBookComponentUploading={updateBookComponentUploading}
          divisionId={divisionId}
          goToEditor={goToEditor}
          lock={lock}
          onWarning={onWarning}
          onWorkflowUpdate={onWorkflowUpdate}
          outerContainer={outerContainer}
          pagination={pagination}
          rules={rules}
          showModal={showModal}
          showModalToggle={showModalToggle}
          trackChangesEnabled={trackChangesEnabled}
          updateBookComponentContent={updateBookComponentContent}
          // update={update}
          updateBookComponentUploading={updateBookComponentUploading}
          updatePagination={updatePagination}
          updateWorkflowState={updateWorkflowState}
          uploadBookComponent={uploadBookComponent}
          workflowStages={workflowStages}
          showModal={showModal}
        />
      )}
    </BookComponentContainer>
  )
}

// export { BookComponent as UnwrappedBookComponent }
export default BookComponent

// export default flow(
//   DragSource(itemTypes.BOOK_COMPONENT, bookComponentSource, collectDrag),
//   DropTarget(itemTypes.BOOK_COMPONENT, bookComponentTarget, collectDrop),
// )(BookComponent)
