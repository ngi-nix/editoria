import { keys, map, indexOf, includes } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import config from 'config'
import AlignmentTool from './AlignmentTool'
import StateList from './StateList'
import UploadButton from './UploadButton'
import ProgressModal from './ProgressModal'

import styles from '../styles/bookBuilder.local.scss'

class ChapterSecondRow extends React.Component {
  constructor(props) {
    super(props)

    this.onClickAlignmentBox = this.onClickAlignmentBox.bind(this)
    this.changeProgressState = this.changeProgressState.bind(this)
    this.updateStateList = this.updateStateList.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.progressValues = [-1, 0, 1]
    this.progressOrder = []
    this.state = {
      nextProgressValues: {
        type:null,
        value: null,
      },
      modalType:null,
      showModal:false,
    }

    for (let i = 0; i < config.bookBuilder.stages.length; i += 1) {
      this.progressOrder.push(config.bookBuilder.stages[i].type)
    }
  }

  updateStateList(name, index) {
    const { chapter, update } = this.props

    if(name === 'review' && (index === -1 || index === 1)) {
      this.setState({
        nextProgressValues: {
          type:name,
          value: index,
        },
        modalType:'review',
        showModal:true
      })  
    } else if (name === 'edit' && (index === -1 || index === 1)) {
        this.setState({
          nextProgressValues: {
            type:name,
            value: index,
          },
          modalType:'edit',
          showModal:true
        })
    } else if (name === 'edit' && index === 0 && chapter.progress.review === 0) {
      this.setState({
        nextProgressValues: {
          type:name,
          value: index,
        },
        modalType:'review',
        showModal:true
      })
    } else if (name === 'file_prep' && (index === 0 && (chapter.progress.edit === 0 || chapter.progress.review === 0))) {
      this.setState({
        nextProgressValues: {
          type:name,
          value: index,
        },
        modalType:'both',
        showModal:true
      })
    } else {
      const patch = {
        id: chapter.id,
        progress: chapter.progress,
      }
      if (index === 1) {
        patch.progress[name] = index
        const next = indexOf(this.progressOrder, name) + 1
        const type = this.progressOrder[next]
        patch.progress[type] = 0
      }

      if (index === -1) {
        patch.progress[name] = index
        const next = indexOf(this.progressOrder, name) + 1
        const type = this.progressOrder[next]
        patch.progress[type] = -1
      }

      if (index === 0) {
        patch.progress[name] = index
        const next = indexOf(this.progressOrder, name) + 1
        for (let i = next; i < this.progressOrder.length; i += 1) {
          const type = this.progressOrder[i]
          patch.progress[type] = -1
        }
      }

      update(patch)
    }
  }

  changeProgressState() {
    const { chapter, update, showModalToggle } = this.props
    const name = this.state.nextProgressValues.type
    const index = this.state.nextProgressValues.value

    const patch = {
      id: chapter.id,
      progress: chapter.progress,
    }
    if (index === 1) {
      patch.progress[name] = index
      const next = indexOf(this.progressOrder, name) + 1
      const type = this.progressOrder[next]
      patch.progress[type] = 0
    }

    if (index === -1) {
      patch.progress[name] = index
      const next = indexOf(this.progressOrder, name) + 1
      const type = this.progressOrder[next]
      patch.progress[type] = -1
    }

    if (index === 0) {
      patch.progress[name] = index
      const next = indexOf(this.progressOrder, name) + 1
      for (let i = next; i < this.progressOrder.length; i += 1) {
        const type = this.progressOrder[i]
        patch.progress[type] = -1
      }
    }

    update(patch)
    this.setState({
      nextProgressValues: {
        type:null,
        value: null,
      },
      modalType:null,
      showModal:false
    })
  }

  onClickAlignmentBox(id) {
    const { chapter, update } = this.props

    const patch = {
      alignment: chapter.alignment,
      id: chapter.id,
    }

    patch.alignment[id] = !chapter.alignment[id]
    update(patch)
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  renderModal() {
    const { chapter, outerContainer, } = this.props
    const {modalType, showModal} = this.state

    // const typesWithModal = ['edit', 'review']
    // if (!includes(typesWithModal, type)) return null

    return (
      <ProgressModal
        changeProgressState={this.changeProgressState}
        chapter={chapter}
        container={outerContainer}
        show={showModal}
        modalType={modalType}
        toggle={this.toggleModal}
      />
    )
  }

  render() {
    const {
      chapter,
      convertFile,
      isUploadInProgress,
      outerContainer,
      toggleUpload,
      update,
    } = this.props

    const alignmentOptions = []
    map(keys(chapter.alignment), key => {
      const option = {
        active: chapter.alignment[key],
        id: key,
        label: key,
      }
      alignmentOptions.push(option)
    })

    const warningModal = this.renderModal()
    return (
      <div className={styles.secondLineContainer}>
        {warningModal}
        <Authorize object={chapter} operation="can view uploadButton">
          <UploadButton
            accept=".doc,.docx"
            chapter={chapter}
            convertFile={convertFile}
            isUploadInProgress={isUploadInProgress}
            modalContainer={outerContainer}
            title=" "
            toggleUpload={toggleUpload}
            type="file"
            update={update}
          />
        </Authorize>
        <StateList
          bookId={chapter.book}
          currentValues={chapter.progress}
          update={this.updateStateList}
          values={this.progressValues}
        />
        <Authorize object={chapter} operation="can view alignmentTool">
          <AlignmentTool
            data={alignmentOptions}
            onClickAlignmentBox={this.onClickAlignmentBox}
          />
        </Authorize>
      </div>
    )
  }
}

ChapterSecondRow.propTypes = {
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
  convertFile: PropTypes.func.isRequired,
  outerContainer: PropTypes.any.isRequired,
  isUploadInProgress: PropTypes.bool,
  toggleUpload: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
}

ChapterSecondRow.defaultProps = {
  isUploadInProgress: false,
}

export default ChapterSecondRow
