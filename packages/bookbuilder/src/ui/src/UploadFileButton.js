import React from 'react'
import { map } from 'lodash'
import axios from 'axios'
import styled, { keyframes, css } from 'styled-components'
import { Subscription } from 'react-apollo'
// import { useSubscription } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import UploadWarningModal from './UploadWarningModal'
import UploadButton from './UploadButton'

const animation = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
`

const DOCX_TO_HTML_JOB = gql`
  subscription DocxToHTMLJob($jobId: String!) {
    docxToHTMLJob(jobId: $jobId) {
      id
      status
      html
    }
  }
`

const StyledUpload = styled(UploadButton)`
  flex-basis: ${({ componentType }) =>
    componentType === 'part' ? '16.6%' : '15.6%'};
  ${({ uploading }) => {
    if (uploading) {
      return css`
        animation: ${animation} 2s infinite;
      `
    }
  }}
`

let title = ''

const UploadFileButton = ({
  bookComponentId,
  onWarning,
  updateBookComponentContent,
  updateBookComponentUploading,
  workflowStages,
  componentType,
  lock,
  uploading,
  uploadBookComponent,
  modalContainer,
  showModal,
  showModalToggle,
}) => {
  const isLocked = () => {
    if (lock === null || lock === undefined) return false
    return true
  }
  const handleFileUpload = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const filename = file.name
    title = filename.split('.')[0]
    const extension = filename.split('.')[1]

    if (extension !== 'docx') {
      return onWarning(
        'This file extension is not supported by our system. Try to use only files with extension .docx',
      )
    }
    const bodyFormData = new FormData()
    bodyFormData.append('file', file)
    updateBookComponentUploading({
      variables: {
        input: {
          id: bookComponentId,
          uploading: true,
        },
      },
    })

    uploadBookComponent.uploadBookComponent({
      variables: {
        file,
      },
    })

    // updateBookComponentUploading({
    //       variables: {
    //         input: {
    //           id: bookComponentId,
    //           uploading: false,
    //         },
    //       },
    //     })
    return true
  }

  let text = 'upload word'
  if (uploading) {
    text = 'uploading'
  }

  const upload = (
    <StyledUpload
      accept=".docx"
      componentType={componentType}
      disabled={uploading || isLocked()}
      id={bookComponentId}
      label={text}
      onChange={handleFileUpload}
      uploading={uploading}
    />
  )

  const { id } = (
    (uploadBookComponent.uploadBookComponentResult || {}).data || {}
  ).createDocxToHTMLJob || { id: false }

  if (!id) return upload


  const triggerRefetch = ({
    subscriptionData: {
      data: {
        docxToHTMLJob: { status, html },
      },
    },
  }) => {
    if (status === 'Done') {
      workflowStages[0].value = 1
      workflowStages[1].value = 0
      const resWorkflowStages = map(workflowStages, item => ({
        label: item.label,
        type: item.type,
        value: item.value,
      }))

      updateBookComponentContent({
        variables: {
          input: {
            id: bookComponentId,
            title,
            content: html,
            uploading: false,
            workflowStages: resWorkflowStages,
          },
        },
      })
    }
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={DOCX_TO_HTML_JOB}
      variables={{ jobId: id }}
    >
      {() => upload}
    </Subscription>
  )
}

export default UploadFileButton
