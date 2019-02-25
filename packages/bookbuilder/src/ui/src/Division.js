import { clone, find, map } from 'lodash'
import config from 'config'
import React from 'react'
// import { DragDropContext } from 'react-dnd'
// import HTML5Backend from 'react-dnd-html5-backend'
import { Draggable, Droppable } from 'react-beautiful-dnd'
// import Authorize from 'pubsweet-client/src/helpers/Authorize'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

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
  padding-top: 0.1em;
`
const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: calc(2 * ${th('gridUnit')});
`
const DivisionActions = styled.div`
  display: flex;
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
    // this.onEndDrag = this.onEndDrag.bind(this)
    // this.onMove = this.onMove.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onUpdatePagination = this.onUpdatePagination.bind(this)
    this.onUpdateWorkflowState = this.onUpdateWorkflowState.bind(this)

    // this.state = {
    //   bookComponents: props.bookComponents,
    // }
  }

  componentWillReceiveProps(nextProps) {
    // const diff = difference(this.state.bookComponents, nextProps.bookComponents)
    // if (diff.length > 0) {
    //   console.log('diff', diff)
    // this.setState({
    //   bookComponents: nextProps.bookComponents,
    // })
    // }
    // return false
  }

  onAddClick(componentType) {
    const { add, bookId, divisionId } = this.props

    add({
      variables: {
        input: {
          title: 'Untitled',
          bookId,
          componentType,
          divisionId,
        },
      },
    })
  }

  // When drag is released, send all updates necessary
  // onEndDrag(params) {
  //   // console.log('comp', params)
  //   const { updateBookComponentOrder } = this.props
  //   updateBookComponentOrder({
  //     variables: {
  //       targetDivisionId: params.divisionId,
  //       bookComponentId: params.id,
  //       index: params.no,
  //     },
  //   })
  // }

  // // When moving chapters, keep their order in the state
  // onMove(dragIndex, hoverIndex, dragDivision, hoverDivision) {
  //   const { bookComponents } = this.state
  //   const chs = clone(bookComponents)
  //   // Change dragged fragment position in the array
  //   const dragged = chs.splice(dragIndex, 1)[0] // remove
  //   chs.splice(hoverIndex, 0, dragged) // reinsert at new position
  //   this.setState({ bookComponents: chs })
  // }

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
      updateBookComponentUploading,
      updateBookComponentContent,
      outerContainer,
      divisionId,
      showModal,
      showModalToggle,
      history,
      bookComponents,
      label,
      update,
      reorderingAllowed,
    } = this.props

    const bookComponentInstances = map(bookComponents, (bookComponent, i) => {
      const {
        componentType,
        uploading,
        bookId,
        lock,
        divisionId,
        componentTypeOrder,
        hasContent,
        title,
        id,
        workflowStages,
        pagination,
        trackChangesEnabled,
      } = bookComponent
      return (
        <Draggable key={id} draggableId={id} index={i}>
          {(provided, snapshot) => {
            return (
              <div ref={provided.innerRef} {...provided.draggableProps}>
                <BookComponent
                  provided={provided}
                  bookId={bookId}
                  canDrag={reorderingAllowed}
                  componentType={componentType}
                  componentTypeOrder={componentTypeOrder}
                  divisionId={divisionId}
                  divisionType={label}
                  history={history}
                  id={id}
                  updateBookComponentContent={updateBookComponentContent}
                  updateBookComponentUploading={updateBookComponentUploading}
                  key={id}
                  lock={lock}
                  no={i}
                  onEndDrag={() => console.log('hello')}
                  hasContent={hasContent}
                  onMove={() => console.log('hello')}
                  outerContainer={outerContainer}
                  showModal={showModal}
                  showModalToggle={showModalToggle}
                  pagination={pagination}
                  remove={this.onRemove}
                  title={title}
                  trackChangesEnabled={trackChangesEnabled}
                  update={update}
                  updatePagination={this.onUpdatePagination}
                  updateWorkflowState={this.onUpdateWorkflowState}
                  uploading={uploading}
                  workflowStages={workflowStages}
                />
              </div>
            )
          }}
        </Draggable>
      )
    })
    const divisionsConfig = find(config.bookBuilder.divisions, ['name', label])

    const addButtons =
      // <Authorize object={bookId} operation="can view addComponent">
      map(divisionsConfig.allowedComponentTypes, componentType => (
        <AddComponentButton
          add={this.onAddClick}
          label={`add ${componentType}`}
          type={componentType}
        />
      ))
    // </Authorize>

    // const list = (
    //   <ul className={styles.sectionChapters}> {bookComponentInstances} </ul>
    // )

    // const emptyList = (
    //   <div className={styles.noChapters}>
    //     There are no items in this division.
    //   </div>
    // )

    // const displayed = bookComponents.length > 0 ? list : emptyList

    return (
      <DivisionContainer>
        <HeaderContainer>
          <DivisionHeader>{label.toUpperCase()}</DivisionHeader>
          <DivisionActions>{addButtons}</DivisionActions>
        </HeaderContainer>
        <Droppable droppableId={divisionId}>
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                style={{
                  opacity: snapshot.isDraggingOver ? 0.5 : 1,
                  minHeight: '96px',
                }}
              >
                {bookComponents.length > 0 ? (
                  <BookComponentList>
                    {bookComponentInstances}
                  </BookComponentList>
                ) : (
                  <EmptyList>There are no items in this division.</EmptyList>
                )}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </DivisionContainer>
    )
  }
}

// export { Division as UnWrappedDivision }
export default Division
// export default DragDropContext(HTML5Backend)(Division)
