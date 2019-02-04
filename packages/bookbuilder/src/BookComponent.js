import { flow } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import config from 'config'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import FirstRow from './Chapter/FirstRow'
import SecondRow from './Chapter/SecondRow'

import {
  bookComponentSource,
  bookComponentTarget,
  collectDrag,
  collectDrop,
  itemTypes,
} from './dnd'

import styles from './styles/bookBuilder.local.scss'

class BookComponent extends React.PureComponent {
  constructor(props) {
    super(props)

    this.toggleUpload = this.toggleUpload.bind(this)
    this.update = this.update.bind(this)

    this.state = {
      isUploadInProgress: false,
    }
  }

  update(patch) {
    const { bookId, update, trackChangesEnabled } = this.props
    // SHOULD BE REMOVED. This automaticaly sets track changes on for the case
    // or review in progress
    if (
      config.bookBuilder &&
      config.bookBuilder.instance &&
      config.bookBuilder.instance === 'UCP'
    ) {
      if (patch.workflowStages) {
        if (
          patch.workflowStages.review === 0 &&
          trackChangesEnabled === false
        ) {
          patch.trackChanges = true
        }
      }
    }
    update(bookId, patch)
  }

  toggleUpload() {
    // this.setState({
    //   isUploadInProgress: !this.state.isUploadInProgress,
    // })

    // if (!this.state.isUploadInProgress) this.removeUploadState()
  }

  render() {
    const {
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
    } = this.props
    // const { isUploadInProgress } = this.state
    const listItemStyle = {
      opacity: isDragging ? 0.5 : 1,
    }
    const indicatorGrabAllowed = allowed => {
      if (uploading || !allowed) {
        return (
          <div className={`${styles.grabContainer} ${styles.notAllowed}`}>
            <svg viewBox="0 0 24 48">
              <circle
                cx="110%"
                cy="50%"
                fill="transparent"
                r="20"
                stroke={hasContent === true ? '#0d78f2' : '#666'}
                strokeWidth="2"
              />
              <circle
                cx="110%"
                cy="50%"
                fill={hasContent === true ? '#0d78f2' : '#666'}
                r="17"
                strokeWidth="0"
              />
            </svg>
          </div>
        )
      }
      return (
        <div
          className={styles.grabContainer}
          // className={`${styles.grabIcon} ${
          //   hasContent === true ? styles.hasContent : ''
          // }`}
        >
          <svg viewBox="0 0 24 48">
            <circle
              cx="110%"
              cy="50%"
              fill="transparent"
              r="20"
              stroke={hasContent === true ? '#0d78f2' : '#666'}
              strokeWidth="2"
            />
            <circle
              cx="110%"
              cy="50%"
              fill={hasContent === true ? '#0d78f2' : '#666'}
              r="17"
              strokeWidth="0"
            />
          </svg>
          <div className={styles.tooltip}>grab to sort</div>
        </div>
      )
    }

    // TODO -- refactor these huge class names
    // TODO -- make the dot and line component/s
    return connectDragSource(
      connectDropTarget(
        <li
          className={`${styles.chapterContainer}  ${
            componentType === 'chapter' || componentType === 'unnumbered'
              ? styles.isChapter
              : ''
          }`}
          style={listItemStyle}
        >
          <Authorize
            object={bookId}
            operation="can reorder bookComponents"
            unauthorized={indicatorGrabAllowed(false)}
          >
            {indicatorGrabAllowed(true)}
          </Authorize>

          <div className={` ${styles.chapterMainContent}`}>
            <FirstRow
              bookComponentId={id}
              bookId={bookId}
              componentType={componentType}
              componentTypeOrder={componentTypeOrder}
              divisionType={divisionType}
              lock={lock}
              outerContainer={outerContainer}
              remove={remove}
              title={title}
              update={this.update}
              uploading={uploading}
              user={user}
            />

            <SecondRow
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
              update={this.update}
              updatePagination={updatePagination}
              updateWorkflowState={updateWorkflowState}
              viewOrEdit={this._viewOrEdit}
              workflowStages={workflowStages}
            />
          </div>
        </li>,
      ),
    )
  }
}

BookComponent.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  chapter: PropTypes.shape({
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
    componentType: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  ink: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired,
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
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  uploading: PropTypes.bool,
}

BookComponent.defaultProps = {
  uploading: false,
  title: null,
}

export { BookComponent as UnwrappedBookComponent }

export default flow(
  DragSource(itemTypes.BOOK_COMPONENT, bookComponentSource, collectDrag),
  DropTarget(itemTypes.BOOK_COMPONENT, bookComponentTarget, collectDrop),
)(BookComponent)
