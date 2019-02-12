import { clone, find, map } from 'lodash'
import config from 'config'
import React from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import AddComponentButton from './AddComponentButton'
import BookComponent from './BookComponent'

const DivisionContainer = styled.div`
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
const BookComponentList = styled.ul`
  color: ${th('colorText')};
  font-family: 'Fira Sans';
  font-size: ${th('fontSizeBase')};
  font-style: normal;
  font-weight: normal;
  line-height: ${th('lineHeightBase')};
`
class Division extends React.Component {
  constructor(props) {
    super(props)

    this.onAddClick = this.onAddClick.bind(this)
    this.onEndDrag = this.onEndDrag.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this.onUpdatePagination = this.onUpdatePagination.bind(this)
    this.onUpdateWorkflowState = this.onUpdateWorkflowState.bind(this)

    this.state = {
      bookComponents: props.bookComponents,
    }
  }

  componentWillReceiveProps(nextProps) {
    // const diff = difference(this.state.bookComponents, nextProps.bookComponents)
    // if (diff.length > 0) {
    //   console.log('diff', diff)
    this.setState({
      bookComponents: nextProps.bookComponents,
    })
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
  onEndDrag(params) {
    // console.log('comp', params)
    const { updateBookComponentOrder } = this.props
    updateBookComponentOrder({
      variables: {
        targetDivisionId: params.divisionId,
        bookComponentId: params.id,
        index: params.no,
      },
    })
  }

  // // When moving chapters, keep their order in the state
  onMove(dragIndex, hoverIndex, dragDivision, hoverDivision) {
    const { bookComponents } = this.state
    const chs = clone(bookComponents)
    // Change dragged fragment position in the array
    const dragged = chs.splice(dragIndex, 1)[0] // remove
    chs.splice(hoverIndex, 0, dragged) // reinsert at new position
    this.setState({ bookComponents: chs })
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
      updateBookComponentUploading,
      updateBookComponentContent,
      outerContainer,
      // bookComponents,
      label,
      update,
      reorderingAllowed,
      bookId,
    } = this.props
    const { bookComponents } = this.state
    const {
      onAddClick,
      onRemove,
      onUpdatePagination,
      onUpdateWorkflowState,
      onMove,
      onEndDrag,
    } = this

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
        <BookComponent
          bookId={bookId}
          canDrag={reorderingAllowed}
          componentType={componentType}
          componentTypeOrder={componentTypeOrder}
          divisionId={divisionId}
          divisionType={label}
          id={id}
          updateBookComponentContent={updateBookComponentContent}
          updateBookComponentUploading={updateBookComponentUploading}
          key={bookComponent.id}
          lock={lock}
          no={i}
          onEndDrag={onEndDrag}
          hasContent={hasContent}
          onMove={onMove}
          outerContainer={outerContainer}
          pagination={pagination}
          remove={onRemove}
          title={title}
          trackChangesEnabled={trackChangesEnabled}
          update={update}
          updatePagination={onUpdatePagination}
          updateWorkflowState={onUpdateWorkflowState}
          uploading={uploading}
          workflowStages={workflowStages}
        />
      )
    })
    const divisionsConfig = find(config.bookBuilder.divisions, ['name', label])

    const addButtons =
      // <Authorize object={bookId} operation="can view addComponent">
      map(divisionsConfig.allowedComponentTypes, componentType => (
        <AddComponentButton
          add={onAddClick}
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
        {bookComponents.length > 0 ? (
          <BookComponentList>{bookComponentInstances}</BookComponentList>
        ) : (
          <EmptyList>There are no items in this division.</EmptyList>
        )}
      </DivisionContainer>
    )
  }
}

export { Division as UnWrappedDivision }
// export default Division
export default DragDropContext(HTML5Backend)(Division)
