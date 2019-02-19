import { findIndex, find, forIn } from 'lodash'
import React, { Component } from 'react'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import config from 'config'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { AlignmentTool } from '@pubsweet/ui'
// import AlignmentTool from './AlignmentTool'
import WorkflowList from './WorkflowList'
import UploadFileButton from './UploadFileButton'
import ProgressModal from './ProgressModal'
// import {AlignmentTool} from '@pubsweet/ui'

const SecondRowContainer = styled.div`
  display: flex;
  padding-left: calc(4 * ${th('gridUnit')});
  align-items: center;
  justify-content: space-between;
`

class SecondRow extends Component {
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
    const isLast =
      workflowStages.length - 1 ===
      findIndex(workflowStages, { label: title, type })
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
        this.setState({
          nextProgressValues: {
            title,
            type,
            value,
          },
          modalType: 'cp-yes',
          showModal: true,
        })
      } else {
        const indexOfStage = findIndex(workflowStages, { label: title, type })

        if (value === 1) {
          workflowStages[indexOfStage].value = value
          if (!isLast) {
            workflowStages[indexOfStage + 1].value = 0
          }
        }

        if (value === -1) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1

          if (type !== 'file_prep') {
            const previous = indexOfStage - 1
            workflowStages[previous].value = 0
          }
          workflowStages[next].value = -1
        }

        if (value === 0) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          for (let i = next; i < workflowStages.length; i += 1) {
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
        const indexOfStage = findIndex(workflowStages, { label: title, type })

        if (value === 1) {
          workflowStages[indexOfStage].value = value
          if (!isLast) {
            workflowStages[indexOfStage + 1].value = 0
          }
        }

        if (value === -1) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          if (type !== 'file_prep') {
            const previous = indexOfStage - 1
            workflowStages[previous].value = 0
          }
          workflowStages[next].value = -1
        }

        if (value === 0) {
          workflowStages[indexOfStage].value = value
          const next = indexOfStage + 1
          for (let i = next; i < workflowStages.length; i += 1) {
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
    const isLast =
      workflowStages.length - 1 ===
      findIndex(workflowStages, { label: title, type })
    const indexOfStage = findIndex(workflowStages, { label: title, type })

    if (value === 1) {
      workflowStages[indexOfStage].value = value
      if (!isLast) {
        workflowStages[indexOfStage + 1].value = 0
      }
    }

    if (value === -1) {
      workflowStages[indexOfStage].value = value
      const next = indexOfStage + 1
      if (type !== 'file_prep') {
        const previous = indexOfStage - 1
        workflowStages[previous].value = 0
      }
      workflowStages[next].value = -1
    }

    if (value === 0) {
      workflowStages[indexOfStage].value = value
      const next = indexOfStage + 1
      for (let i = next; i < workflowStages.length; i += 1) {
        workflowStages[i].value = -1
      }
    }

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
      uploading,
      lock,
      showModal,
      showModalToggle,
      updateBookComponentContent,
      updateBookComponentUploading,
      outerContainer,
      pagination,
      workflowStages,
    } = this.props
    const warningModal = this.renderModal()
    const paginationData = []
    forIn(pagination, (value, key) => {
      if (key !== '__typename') {
        paginationData.push({ id: key, active: value, label: key })
      }
    })

    return (
      <SecondRowContainer>
        {warningModal}
        <Authorize object={bookComponentId} operation="can view uploadButton">
          <UploadFileButton
            bookComponentId={bookComponentId}
            updateBookComponentContent={updateBookComponentContent}
            updateBookComponentUploading={updateBookComponentUploading}
            workflowStages={workflowStages}
            componentType={componentType}
            lock={lock}
            uploading={uploading}
            modalContainer={outerContainer}
            showModal={showModal}
            showModalToggle={showModalToggle}
          />
        </Authorize>
        <Authorize object={bookComponentId} operation="can view stateList">
          <WorkflowList
            bookId={bookId}
            currentValues={workflowStages}
            update={this.updateStateList}
            values={this.progressValues}
          />
        </Authorize>
        <Authorize object={bookComponentId} operation="can view alignmentTool">
          <AlignmentTool
            data={paginationData}
            onClickAlignmentBox={this.onClickAlignmentBox}
          />
        </Authorize>
      </SecondRowContainer>
    )
  }
}

export default SecondRow
