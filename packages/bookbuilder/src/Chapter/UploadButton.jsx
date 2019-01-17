import React from 'react'
import PropTypes from 'prop-types'

import UploadWarningModal from './UploadWarningModal'
import styles from '../styles/bookBuilder.local.scss'

export class UploadButton extends React.Component {
  constructor(props) {
    super(props)

    this.handleFileUpload = this.handleFileUpload.bind(this)
    this.onClick = this.onClick.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      showModal: false,
    }
  }

  handleFileUpload(event) {
    event.preventDefault()

    const file = event.target.files[0]
    const filename = file.name
    const title = filename.split('.')[0]
    const { bookComponentId, convertFile, toggleUpload, update } = this.props

    toggleUpload()
    const patch = {
      id: bookComponentId,
      progress: {
        upload: 0,
        file_prep: -1,
        edit: -1,
        review: -1,
        clean_up: -1,
        page_check: -1,
        final: -1,
      },
    }

    update(patch)
    // update(patch).then(res => {
    convertFile(file)
      .then(response => {
        const patch = {
          id: bookComponentId,
          content: response.converted,
          title,
        }

        update(patch)
        toggleUpload()
      })
      .catch(error => {
        console.error('INK error', error)
        const patch = {
          id: bookComponentId,
        }
        update(patch)
        toggleUpload()
      })
    // })
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  isLocked() {
    const { lock } = this.props

    if (lock === null) return false
    return true
  }

  onClick() {
    if (!this.isLocked()) return
    this.toggleModal()
  }

  renderUploadIndicator() {
    const { isUploadInProgress } = this.props
    if (isUploadInProgress) return true

    return false
  }

  renderInput() {
    let noAction = false
    let uploadClass = ''
    let text = 'upload word'
    let disabled = ''
    const uploadIndicator = this.renderUploadIndicator()
    if (uploadIndicator) {
      uploadClass = styles['animate-flicker']
      text = 'uploading...'
      disabled = styles['no-actions']
    }
    if (this.isLocked()) noAction = true

    const { accept, title, type, bookComponentId } = this.props

    return (
      <div className={styles.btnContainer}>
        <i
          className={`${styles.uploadIcon} ${uploadClass} ${disabled}`}
          disabled={noAction}
          htmlFor={`single-file-uploader${bookComponentId}`}
        />
        <label
          className={`${styles.uploadText} ${disabled}`}
          disabled={noAction}
          htmlFor={`single-file-uploader${bookComponentId}`}
        >
          {text}
        </label>
        <input
          accept={accept}
          disabled={noAction}
          id={`single-file-uploader${bookComponentId}`}
          name="single-file-uploader"
          onChange={this.handleFileUpload}
          title={title}
          type={type}
        />
      </div>
    )
  }

  renderModal() {
    if (!this.isLocked()) return null

    const { showModal } = this.state
    const { componentType, modalContainer } = this.props

    return (
      <UploadWarningModal
        container={modalContainer}
        show={showModal}
        toggle={this.toggleModal}
        type={componentType}
      />
    )
  }

  render() {
    const input = this.renderInput()
    const modal = this.renderModal()

    // TODO -- refactor with chapter buttons lock
    let buttonStyle = {}
    if (this.isLocked()) {
      buttonStyle = {
        opacity: '0.3',
      }
    }

    return (
      <div
        className={styles.btnFile}
        id="bb-upload"
        onClick={this.onClick}
        style={buttonStyle}
      >
        {input}
        {modal}
      </div>
    )
  }
}

UploadButton.propTypes = {
  accept: PropTypes.string.isRequired,
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
    content: PropTypes.string,
    status: PropTypes.string,
    subCategory: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  convertFile: PropTypes.func.isRequired,
  modalContainer: PropTypes.any.isRequired,
  isUploadInProgress: PropTypes.bool,
  title: PropTypes.string.isRequired,
  toggleUpload: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
}

UploadButton.defaultProps = {
  isUploadInProgress: false,
}

export default UploadButton
