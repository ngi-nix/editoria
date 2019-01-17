import React from 'react'
import PropTypes from 'prop-types'

import ChapterButtons from './ChapterButtons'
import ChapterTitle from './ChapterTitle'
import styles from '../styles/bookBuilder.local.scss'

class ChapterFirstRow extends React.Component {
  constructor(props) {
    super(props)

    this.onClickRename = this.onClickRename.bind(this)
    // this.onClickSave = this.onClickSave.bind(this)
    this.onSaveRename = this.onSaveRename.bind(this)

    this.state = {
      isRenameEmpty: false,
      isRenamingTitle: false,
    }
  }

  onClickRename() {
    this.setState({
      isRenamingTitle: true,
    })
  }

  /* eslint-disable  consistent-return */
  onSaveRename(title) {
    const { bookComponentId, update } = this.props
    title = title.trim()

    if (title.length === 0) {
      return this.setState({
        isRenameEmpty: true,
      })
    }

    this.setState({ isRenameEmpty: false })

    const patch = {
      id: bookComponentId,
      title,
    }
    update(patch)

    this.setState({ isRenamingTitle: false })
  }
  /* eslint-enable */

  // follow a chain of refs to call the save function of the input
  // this is done to facilitate sibling-sibling component communication
  // without having to setup an event-based system for a single use case
  // onClickSave () {
  //   this.chapterTitle.save()
  // }

  render() {
    const {
      divisionType,
      bookComponentId,
      bookId,
      uploading,
      componentTypeOrder,
      outerContainer,
      remove,
      user,
      title,
      lock,
      componentType,
      update,
    } = this.props
    const { isRenameEmpty, isRenamingTitle } = this.state

    return (
      <div className={styles.FirstRow}>
        <ChapterTitle
          bookComponentId={bookComponentId}
          bookId={bookId}
          componentType={componentType}
          componentTypeOrder={componentTypeOrder}
          divisionType={divisionType}
          isRenameEmpty={isRenameEmpty}
          isRenaming={isRenamingTitle}
          lock={lock}
          onSaveRename={this.onSaveRename}
          title={title}
          update={update}
          uploading={uploading}
        />

        <ChapterButtons
          bookComponentId={bookComponentId}
          bookId={bookId}
          componentType={componentType}
          isRenaming={isRenamingTitle}
          lock={lock}
          modalContainer={outerContainer}
          onClickRename={this.onClickRename}
          remove={remove}
          update={update}
          uploading={uploading}
          user={user}
        />
      </div>
    )
  }
}

ChapterFirstRow.propTypes = {
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
    subCategory: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  isUploadInProgress: PropTypes.bool,
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
}

ChapterFirstRow.defaultProps = {
  isUploadInProgress: false,
  title: null,
}

export default ChapterFirstRow
