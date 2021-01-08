import { find, map } from 'lodash'
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import AddComponentButton from './AddComponentButton'
import BookComponent from './BookComponent'

const DivisionContainer = styled.div`
  counter-reset: component chapter part unnumbered;
  display: flex;
  flex-direction: column;
  margin-bottom: calc(4 * ${th('gridUnit')});
`
const DivisionHeader = styled.span`
  color: ${th('colorPrimary')};
  flex-basis: content;
  font-family: 'Vollkorn';
  font-size: ${th('fontSizeHeading3')};
  font-style: normal;
  font-weight: normal;
  letter-spacing: 5px;
  line-height: ${th('lineHeightHeading3')};
  margin: 0 calc(2 * ${th('gridUnit')}) 0 0;
  padding-top: 5px;
`
const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: calc(2 * ${th('gridUnit')});
`
const DivisionActions = styled.div`
  display: flex;
  > button:not(:last-child) {
    margin-right: ${grid(1)};
  }
`

const EmptyList = styled.div`
  color: ${th('colorText')};
  font-family: 'Fira Sans';
  font-size: ${th('fontSizeBase')};
  font-style: normal;
  font-weight: normal;
  line-height: ${th('lineHeightBase')};
  margin-left: calc(2 * ${th('gridUnit')});
`
const BookComponentList = styled.div`
  color: ${th('colorText')};
  font-style: normal;
  font-weight: normal;
  z-index: 1;
`
class Division extends React.Component {
  constructor(props) {
    super(props)

    this.onAddClick = this.onAddClick.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onUpdatePagination = this.onUpdatePagination.bind(this)
    this.onUpdateWorkflowState = this.onUpdateWorkflowState.bind(this)
  }

  onAddEndNoteClick = async componentType => {
    const { add, bookId, divisionId, onEndNoteModal } = this.props

    const confirmClicked = await onEndNoteModal(componentType)

    if (confirmClicked) {
      add({
        variables: {
          input: {
            title: 'Notes',
            bookId,
            componentType,
            divisionId,
            pagination: {
              left: false,
              right: true,
            },
          },
        },
      })
    }
  }

  onAddClick(componentType) {
    const { add, bookId, divisionId } = this.props

    add({
      variables: {
        input: {
          bookId,
          componentType,
          divisionId,
        },
      },
    })
  }

  onRemove(bookComponentId) {
    const { deleteBookComponent } = this.props
    deleteBookComponent({
      variables: {
        input: {
          id: bookComponentId,
          deleted: true,
        },
      },
    })
  }

  onUpdatePagination(bookComponentId, pagination) {
    const { updateBookComponentPagination } = this.props
    updateBookComponentPagination({
      variables: {
        input: {
          id: bookComponentId,
          pagination,
        },
      },
    })
  }

  onUpdateWorkflowState(bookComponentId, workflowStates) {
    const { updateBookComponentWorkflowState } = this.props
    const workflowStages = map(workflowStates, item => ({
      label: item.label,
      type: item.type,
      value: item.value,
    }))

    updateBookComponentWorkflowState({
      variables: {
        input: {
          id: bookComponentId,
          workflowStages,
        },
      },
    })
  }

  render() {
    const {
      applicationParameter,
      currentUser,
      updateBookComponentUploading,
      onDeleteBookComponent,
      outerContainer,
      divisionId,
      onWarning,
      showModal,
      toggleIncludeInTOC,
      showModalToggle,
      onWorkflowUpdate,
      onAdminUnlock,
      history,
      bookComponents,
      label,
      update,
      reorderingAllowed,
      updateComponentType,
      updateApplicationParameters,
      uploadBookComponent,
      rules,
    } = this.props

    const { canViewAddComponent } = rules
    const bookComponentInstances = map(bookComponents, (bookComponent, i) => {
      const {
        componentType,
        uploading,
        bookId,
        lock,
        divisionId,
        includeInToc,
        componentTypeOrder,
        hasContent,
        title,
        id,
        workflowStages,
        pagination,
        trackChangesEnabled,
      } = bookComponent
      return (
        <Draggable draggableId={id} index={i} key={id}>
          {provided => (
            <div ref={provided.innerRef} {...provided.draggableProps}>
              <BookComponent
                applicationParameter={applicationParameter}
                bookId={bookId}
                canDrag={reorderingAllowed}
                componentType={componentType}
                componentTypeOrder={componentTypeOrder}
                currentUser={currentUser}
                divisionId={divisionId}
                divisionType={label}
                hasContent={hasContent}
                history={history}
                id={id}
                includeInToc={includeInToc}
                key={id}
                lock={lock}
                no={i}
                onAdminUnlock={onAdminUnlock}
                onDeleteBookComponent={onDeleteBookComponent}
                onWarning={onWarning}
                onWorkflowUpdate={onWorkflowUpdate}
                outerContainer={outerContainer}
                pagination={pagination}
                provided={provided}
                remove={this.onRemove}
                rules={rules}
                showModal={showModal}
                showModalToggle={showModalToggle}
                title={title}
                toggleIncludeInTOC={toggleIncludeInTOC}
                trackChangesEnabled={trackChangesEnabled}
                update={update}
                updateApplicationParameters={updateApplicationParameters}
                updateBookComponentUploading={updateBookComponentUploading}
                updateComponentType={updateComponentType}
                updatePagination={this.onUpdatePagination}
                updateWorkflowState={this.onUpdateWorkflowState}
                uploadBookComponent={uploadBookComponent}
                uploading={uploading}
                workflowStages={workflowStages}
              />
            </div>
          )}
        </Draggable>
      )
    })

    const { config: divisionsConfig } = find(applicationParameter, {
      context: 'bookBuilder',
      area: 'divisions',
    })

    const componentConfig = find(divisionsConfig, ['name', label])

    let addButtons = null

    if (canViewAddComponent) {
      addButtons = map(componentConfig.allowedComponentTypes, componentType =>
        componentType.visibleInHeader ? (
          <AddComponentButton
            add={
              componentType.value === 'endnotes'
                ? this.onAddEndNoteClick
                : this.onAddClick
            }
            disabled={
              bookComponents.find(
                bookComponent => bookComponent.componentType === 'endnotes',
              ) && componentType.value === 'endnotes'
            }
            divisionName={componentConfig.name}
            label={`Add ${componentType.title}`}
            type={componentType.value}
          />
        ) : null,
      )
    }

    return (
      <DivisionContainer data-test-id={`${label}-division`}>
        <HeaderContainer>
          <DivisionHeader>{label.toUpperCase()}</DivisionHeader>
          <DivisionActions>{addButtons}</DivisionActions>
        </HeaderContainer>
        <Droppable droppableId={divisionId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                opacity: snapshot.isDraggingOver ? 0.5 : 1,
                minHeight: '96px',
              }}
            >
              {bookComponents.length > 0 ? (
                <BookComponentList>{bookComponentInstances}</BookComponentList>
              ) : (
                <EmptyList>There are no items in this division.</EmptyList>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DivisionContainer>
    )
  }
}

export default Division
