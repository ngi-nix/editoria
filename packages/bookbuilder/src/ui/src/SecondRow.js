import { findIndex, find, forIn } from 'lodash'
import React, { Component } from 'react'
import config from 'config'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
// import { AlignmentTool } from '@pubsweet/ui'
import AlignmentTool from './AlignmentTool'
import WorkflowList from './WorkflowList'
import UploadFileButton from './UploadFileButton'
import ProgressModal from './ProgressModal'
// import {AlignmentTool} from '@pubsweet/ui'

const SecondRowContainer = styled.div`
  display: flex;
  margin-left: ${({ lock }) => (lock ? '9.9%' : '6.9%')};
  flex-basis: 100%;
  align-items: center;
  justify-content: space-between;
`

class SecondRow extends Component {
  constructor(props) {
    super(props)

    this.onClickAlignmentBox = this.onClickAlignmentBox.bind(this)
    // this.changeProgressState = this.changeProgressState.bind(this)
    this.updateStateList = this.updateStateList.bind(this)
    // this.toggleModal = this.toggleModal.bind(this)
    this.progressValues = [-1, 0, 1]
    this.progressOrder = []
    // this.state = {
    //   nextProgressValues: {
    //     title: null,
    //     type: null,
    //     value: null,
    //   },
    //   modalType: null,
    //   showModal: false,
    // }

    for (let i = 0; i < config.bookBuilder.stages.length; i += 1) {
      this.progressOrder.push(config.bookBuilder.stages[i].type)
    }
  }

  updateStateList(title, type, value) {
    const {
      bookComponentId,
      workflowStages,
      updateWorkflowState,
      onWorkflowUpdate,
    } = this.props
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
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no',
          )
        } else if (find(workflowStages, { type: 'review' }).value === 0) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'author-no',
          )
        } else {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no-author-no',
          )
        }
      } else if (type === 'file_prep' && value === 1) {
        const nextProgressValues = {
          title,
          type,
          value,
        }
        onWorkflowUpdate(
          bookComponentId,
          workflowStages,
          nextProgressValues,
          'cp-yes',
        )
      } else if (type === 'edit') {
        if (value === 1) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no-author-yes',
          )
        } else if (value === 0) {
          if (find(workflowStages, { type: 'review' }).value === 0) {
            const nextProgressValues = {
              title,
              type,
              value,
            }
            onWorkflowUpdate(
              bookComponentId,
              workflowStages,
              nextProgressValues,
              'cp-yes-author-no',
            )
          } else {
            const nextProgressValues = {
              title,
              type,
              value,
            }
            onWorkflowUpdate(
              bookComponentId,
              workflowStages,
              nextProgressValues,
              'cp-yes',
            )
          }
        } else if (find(workflowStages, { type: 'review' }).value === 0) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no-author-no',
          )
        } else {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no',
          )
        }
      } else if (type === 'review') {
        if (value === 0) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no-author-yes',
          )
        } else if (value === 1) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-yes-author-no',
          )
        } else {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-yes-author-no',
          )
        }
      } else if (type === 'clean_up') {
        if (value === 0) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-yes',
          )
        } else if (value === 1) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no',
          )
        } else {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'cp-no-author-yes',
          )
        }
      } else if (type === 'page_check' && value === -1) {
        const nextProgressValues = {
          title,
          type,
          value,
        }
        onWorkflowUpdate(
          bookComponentId,
          workflowStages,
          nextProgressValues,
          'cp-yes',
        )
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
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'author-no',
          )
        } else if (value === 1) {
          const nextProgressValues = {
            title,
            type,
            value,
          }
          onWorkflowUpdate(
            bookComponentId,
            workflowStages,
            nextProgressValues,
            'author-yes',
          )
        }
      } else if (type === 'review' && value === 1) {
        const nextProgressValues = {
          title,
          type,
          value,
        }
        onWorkflowUpdate(
          bookComponentId,
          workflowStages,
          nextProgressValues,
          'author-no',
        )
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

  // changeProgressState() {
  //   const { bookComponentId, workflowStages, updateWorkflowState } = this.props
  //   const { nextProgressValues } = this.state
  //   const { title, type, value } = nextProgressValues
  //   const isLast =
  //     workflowStages.length - 1 ===
  //     findIndex(workflowStages, { label: title, type })
  //   const indexOfStage = findIndex(workflowStages, { label: title, type })

  //   if (value === 1) {
  //     workflowStages[indexOfStage].value = value
  //     if (!isLast) {
  //       workflowStages[indexOfStage + 1].value = 0
  //     }
  //   }

  //   if (value === -1) {
  //     workflowStages[indexOfStage].value = value
  //     const next = indexOfStage + 1
  //     if (type !== 'file_prep') {
  //       const previous = indexOfStage - 1
  //       workflowStages[previous].value = 0
  //     }
  //     workflowStages[next].value = -1
  //   }

  //   if (value === 0) {
  //     workflowStages[indexOfStage].value = value
  //     const next = indexOfStage + 1
  //     for (let i = next; i < workflowStages.length; i += 1) {
  //       workflowStages[i].value = -1
  //     }
  //   }

  //   updateWorkflowState(bookComponentId, workflowStages)
  //   this.setState({
  //     nextProgressValues: {
  //       title: null,
  //       type: null,
  //       value: null,
  //     },
  //     modalType: null,
  //     showModal: false,
  //   })
  // }

  // toggleModal() {
  //   this.setState({
  //     showModal: !this.state.showModal,
  //   })
  // }

  onClickAlignmentBox(id) {
    console.log('i', id)
    const { bookComponentId, pagination, updatePagination } = this.props
    const patch = {
      left: pagination.left,
      right: pagination.right,
    }
    patch[id] = !pagination[id]
    updatePagination(bookComponentId, patch)
  }

  // renderModal() {
  //   const { bookComponentId, componentType, outerContainer } = this.props
  //   const { modalType, showModal } = this.state

  //   return (
  //     <ProgressModal
  //       bookComponentId={bookComponentId}
  //       changeProgressState={this.changeProgressState}
  //       componentType={componentType}
  //       container={outerContainer}
  //       modalType={modalType}
  //       show={showModal}
  //       toggle={this.toggleModal}
  //     />
  //   )
  // }

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
      rules,
      workflowStages,
    } = this.props
    const {
      canViewUploadButton,
      canViewStateList,
      canViewAlignmentTool,
      bookComponentStateRules,
    } = rules

    // const warningModal = this.renderModal()
    const paginationData = []
    forIn(pagination, (value, key) => {
      if (key !== '__typename') {
        paginationData.push({ id: key, active: value, label: key })
      }
    })
    return (
      <SecondRowContainer lock={lock}>
        {canViewUploadButton && (
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
        )}
        {canViewStateList && (
          <WorkflowList
            bookComponentStateRules={bookComponentStateRules.find(
              stateRule => stateRule.bookComponentId === bookComponentId,
            )}
            bookId={bookId}
            currentValues={workflowStages}
            update={this.updateStateList}
            values={this.progressValues}
          />
        )}
        {canViewAlignmentTool && (
          <AlignmentTool
            data={paginationData}
            onClickAlignmentBox={this.onClickAlignmentBox}
          />
        )}
      </SecondRowContainer>
    )
  }
}

export default SecondRow
