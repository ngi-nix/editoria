import { keys, map, indexOf, findIndex, find } from 'lodash'
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
        title: null,
        type: null,
        value: null,
      },
      modalType: null,
      showModal: false,
    }

    for (let i = 0; i < config.bookBuilder.stages.length; i += 1) {
      this.progressOrder.push(config.bookBuilder.stages[i].type)
    }
  }

  updateStateList(title, type, value) {
    const { bookComponentId, workflowStages, updateWorkflowState } = this.props
    console.log('title', title)
    console.log('type', type)
    console.log('index', value)
    if (
      config.bookBuilder &&
      config.bookBuilder.instance &&
      config.bookBuilder.instance === 'UCP'
    ) {
      if (type === 'file_prep' && (value === -1 || value === 0)) {
        if (
          find(workflowStages, { type: 'edit' }).value === 0 ||
          find(workflowStages, { type: 'clean_up' }).value === 0
        ) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no',
            showModal: true,
          })
        } else if (find(workflowStages, { type: 'review' }).value === 0) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'author-no',
            showModal: true,
          })
        } else {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no-author-no',
            showModal: true,
          })
        }
      } else if (type === 'file_prep' && value === 1) {
        this.setState({
          nextProgressValues: {
            title,
            type,
            value,
          },
          modalType: 'cp-yes',
          showModal: true,
        })
      } else if (type === 'edit') {
        if (value === 1) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no-author-yes',
            showModal: true,
          })
        } else if (value === 0) {
          if (find(workflowStages, { type: 'review' }).value === 0) {
            this.setState({
              nextProgressValues: {
                title,
                type,
                value,
              },
              modalType: 'cp-yes-author-no',
              showModal: true,
            })
          } else {
            this.setState({
              nextProgressValues: {
                title,
                type,
                value,
              },
              modalType: 'cp-yes',
              showModal: true,
            })
          }
        } else if (find(workflowStages, { type: 'review' }).value === 0) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no-author-no',
            showModal: true,
          })
        } else {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no',
            showModal: true,
          })
        }
      } else if (type === 'review') {
        if (value === 0) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no-author-yes',
            showModal: true,
          })
        } else if (value === 1) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-yes-author-no',
            showModal: true,
          })
        } else {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-yes-author-no',
            showModal: true,
          })
        }
      } else if (type === 'clean_up') {
        if (value === 0) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-yes',
            showModal: true,
          })
        } else if (value === 1) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no',
            showModal: true,
          })
        } else {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'cp-no-author-yes',
            showModal: true,
          })
        }
      } else if (type === 'page_check' && value === -1) {
        // if (index === -1) {
        this.setState({
          nextProgressValues: {
            title,
            type,
            value,
          },
          modalType: 'cp-yes',
          showModal: true,
        })
        // }
      } else {
        // const patch = {
        //   id: bookComponentId,
        //   workflowStages,
        // }
        // if (value === 1) {
        //   patch.workflowStages[type] = index
        //   const next = indexOf(this.progressOrder, type) + 1
        //   // const type = this.progressOrder[next]
        //   patch.workflowStages[type] = 0
        // }

        // if (index === -1) {
        //   patch.workflowStages[type] = index
        //   const next = indexOf(this.progressOrder, type) + 1
        //   const typeNext = this.progressOrder[next]
        //   if (type !== 'file_prep') {
        //     const previous = indexOf(this.progressOrder, type) - 1
        //     const typePrevious = this.progressOrder[previous]
        //     patch.workflowStages[typePrevious] = 0
        //   }
        //   patch.workflowStages[typeNext] = -1
        // }

        // if (index === 0) {
        //   patch.workflowStages[type] = index
        //   const next = indexOf(this.progressOrder, type) + 1
        //   for (let i = next; i < this.progressOrder.length; i += 1) {
        //     const type = this.progressOrder[i]
        //     patch.workflowStages[type] = -1
        //   }
        // }
        // update(patch)

        const indexOfStage = findIndex(workflowStages, { label: title, type })
        // console.log('workflow', workflowStages)
    
        if (value === 1) {
          workflowStages[indexOfStage].value = value
          workflowStages[indexOfStage + 1].value = 0
          // const next = indexOf(this.progressOrder, type) + 1
          // // const type = this.progressOrder[next]
          // patch.workflowStages[type] = 0
        }
    
        if (value === -1) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          // const typeNext = workflowStages[next].type
          if (type !== 'file_prep') {
            const previous = indexOfStage - 1
            // const typePrevious = workflowStages[previous].type
            workflowStages[previous].value = 0
          }
          workflowStages[next].value = -1
        }
    
        if (value === 0) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          for (let i = next; i < workflowStages.length; i += 1) {
            // const type = this.progressOrder[i]
            workflowStages[i].value = -1
          }
        }
        updateWorkflowState(bookComponentId, workflowStages)    
      }
    }
    if (
      config.bookBuilder &&
      config.bookBuilder.instance &&
      config.bookBuilder.instance === 'BOOKSPRINTS'
    ) {
      if (type === 'clean_up') {
        if (value === 0) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'author-no',
            showModal: true,
          })
        } else if (value === 1) {
          this.setState({
            nextProgressValues: {
              title,
              type,
              value,
            },
            modalType: 'author-yes',
            showModal: true,
          })
        }
      } else if (type === 'review' && value === 1) {
        this.setState({
          nextProgressValues: {
            title,
            type,
            value,
          },
          modalType: 'author-no',
          showModal: true,
        })
      } else {
        // const patch = {
        //   id: bookComponentId,
        //   workflowStages,
        // }
        // if (index === 1) {
        //   patch.workflowStages[type] = index
        //   const next = indexOf(this.progressOrder, type) + 1
        //   // const type = this.progressOrder[next]
        //   patch.workflowStages[type] = 0
        // }

        // if (index === -1) {
        //   patch.workflowStages[type] = index
        //   const next = indexOf(this.progressOrder, type) + 1
        //   const typeNext = this.progressOrder[next]
        //   if (type !== 'file_prep') {
        //     const previous = indexOf(this.progressOrder, type) - 1
        //     const typePrevious = this.progressOrder[previous]
        //     patch.workflowStages[typePrevious] = 0
        //   }
        //   patch.workflowStages[typeNext] = -1
        // }

        // if (index === 0) {
        //   patch.workflowStages[type] = index
        //   const next = indexOf(this.progressOrder, type) + 1
        //   for (let i = next; i < this.progressOrder.length; i += 1) {
        //     const type = this.progressOrder[i]
        //     patch.workflowStages[type] = -1
        //   }
        // }
        // update(patch)

        const indexOfStage = findIndex(workflowStages, { label: title, type })
        // console.log('workflow', workflowStages)
    
        if (value === 1) {
          workflowStages[indexOfStage].value = value
          workflowStages[indexOfStage + 1].value = 0
          // const next = indexOf(this.progressOrder, type) + 1
          // // const type = this.progressOrder[next]
          // patch.workflowStages[type] = 0
        }
    
        if (value === -1) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          // const typeNext = workflowStages[next].type
          if (type !== 'file_prep') {
            const previous = indexOfStage - 1
            // const typePrevious = workflowStages[previous].type
            workflowStages[previous].value = 0
          }
          workflowStages[next].value = -1
        }
    
        if (value === 0) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          for (let i = next; i < workflowStages.length; i += 1) {
            // const type = this.progressOrder[i]
            workflowStages[i].value = -1
          }
        }
        updateWorkflowState(bookComponentId, workflowStages)
      }
    }
  }

  changeProgressState() {
    const { bookComponentId, workflowStages, updateWorkflowState } = this.props
    const { nextProgressValues } = this.state
    const { title, type, value } = nextProgressValues
    // const index = this.state.nextProgressValues.value
    const indexOfStage = findIndex(workflowStages, { label: title, type })
    // console.log('workflow', workflowStages)

    if (value === 1) {
      workflowStages[indexOfStage].value = value
      workflowStages[indexOfStage + 1].value = 0
      // const next = indexOf(this.progressOrder, type) + 1
      // // const type = this.progressOrder[next]
      // patch.workflowStages[type] = 0
    }

    if (value === -1) {
      workflowStages[indexOfStage].value = value
      const next = indexOfStage + 1
      // const typeNext = workflowStages[next].type
      if (type !== 'file_prep') {
        const previous = indexOfStage - 1
        // const typePrevious = workflowStages[previous].type
        workflowStages[previous].value = 0
      }
      workflowStages[next].value = -1
    }

    if (value === 0) {
      workflowStages[indexOfStage].value = value
      const next = indexOfStage + 1
      for (let i = next; i < workflowStages.length; i += 1) {
        // const type = this.progressOrder[i]
        workflowStages[i].value = -1
      }
    }
    // console.log('workafter', workflowStages)

    updateWorkflowState(bookComponentId, workflowStages)
    this.setState({
      nextProgressValues: {
        title: null,
        type: null,
        value: null,
      },
      modalType: null,
      showModal: false,
    })
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  onClickAlignmentBox(id) {
    const { bookComponentId, pagination, updatePagination } = this.props
    const patch = {
      left: pagination.left,
      right: pagination.right,
    }
    patch[id] = !pagination[id]
    updatePagination(bookComponentId, patch)
  }

  renderModal() {
    const { bookComponentId, componentType, outerContainer } = this.props
    const { modalType, showModal } = this.state

    // const typesWithModal = ['edit', 'review']
    // if (!includes(typesWithModal, type)) return null

    return (
      <ProgressModal
        bookComponentId={bookComponentId}
        changeProgressState={this.changeProgressState}
        componentType={componentType}
        container={outerContainer}
        modalType={modalType}
        show={showModal}
        toggle={this.toggleModal}
      />
    )
  }

  render() {
    const {
      bookId,
      bookComponentId,
      componentType,
      convertFile,
      isUploadInProgress,
      outerContainer,
      pagination,
      toggleUpload,
      update,
      workflowStages,
    } = this.props
    const warningModal = this.renderModal()
    return (
      <div className={styles.secondLineContainer}>
        {warningModal}
        <Authorize object={bookComponentId} operation="can view uploadButton">
          <UploadButton
            accept=".doc,.docx"
            bookComponentId={bookComponentId}
            componentType={componentType}
            convertFile={convertFile}
            isUploadInProgress={isUploadInProgress}
            lock={null}
            modalContainer={outerContainer}
            title=" "
            toggleUpload={toggleUpload}
            type="file"
            update={update}
          />
        </Authorize>
        <Authorize object={bookComponentId} operation="can view stateList">
          <StateList
            bookId={bookId}
            currentValues={workflowStages}
            update={this.updateStateList}
            values={this.progressValues}
          />
        </Authorize>
        <Authorize object={bookComponentId} operation="can view alignmentTool">
          <AlignmentTool
            data={pagination}
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
