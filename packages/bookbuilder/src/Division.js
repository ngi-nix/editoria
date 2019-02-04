import {
  clone,
  each,
  filter,
  findIndex,
  forEach,
  find,
  difference,
  groupBy,
  has,
  isEmpty,
  omit,
  map,
} from 'lodash'
import config from 'config'
import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import AddButton from './AddButton'
import BookComponent from './BookComponent'
import styles from './styles/bookBuilder.local.scss'

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
    // console.log('bookvomponentid', bookComponentId)
    // console.log('workflow', workflowStates)
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
    // console.log('bookComponents', bookComponents)

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

    const addButtons = (
      <Authorize object={bookId} operation="can view addComponent">
        {map(divisionsConfig.allowedComponentTypes, componentType => (
          <AddButton add={onAddClick} group={componentType} />
        ))}
      </Authorize>
    )

    const list = (
      <ul className={styles.sectionChapters}> {bookComponentInstances} </ul>
    )

    const emptyList = (
      <div className={styles.noChapters}>
        There are no items in this division.
      </div>
    )

    const displayed = bookComponents.length > 0 ? list : emptyList

    return (
      <div className={styles.divisionsContainer}>
        <div className={styles.sectionHeader}>
          <h1> {label} </h1>
          {addButtons}
        </div>
        <div id="displayed"> {displayed} </div>
      </div>
    )
  }
}

Division.propTypes = {
  add: PropTypes.func.isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  ink: PropTypes.func.isRequired,
  outerContainer: PropTypes.any.isRequired,
  remove: PropTypes.func.isRequired,
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  reorderingAllowed: PropTypes.bool.isRequired,
  uploadStatus: PropTypes.objectOf(PropTypes.bool),
}

export { Division as UnWrappedDivision }
// export default Division
export default DragDropContext(HTML5Backend)(Division)
