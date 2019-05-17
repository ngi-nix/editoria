import React from 'react'
import { map } from 'lodash'
import axios from 'axios'
import styled, { keyframes, css } from 'styled-components'
import UploadWarningModal from './UploadWarningModal'
import UploadButton from './UploadButton'

const animation = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0; }
  100% { opacity: 1; }
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
const UploadFileButton = ({
  bookComponentId,
  onWarning,
  updateBookComponentContent,
  updateBookComponentUploading,
  workflowStages,
  componentType,
  lock,
  uploading,
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
    const title = filename.split('.')[0]
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
    axios({
      method: 'post',
      url: '/api/ink',
      data: bodyFormData,
      config: { headers: { 'Content-Type': 'multipart/form-data' } },
    })
      .then(response => {
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
              content: response.data.converted,
              uploading: false,
              workflowStages: resWorkflowStages,
            },
          },
        })
      })
      .catch(error => {
        console.log('error', error)
        updateBookComponentUploading({
          variables: {
            input: {
              id: bookComponentId,
              uploading: false,
            },
          },
        })
      })
  }

  let text = 'upload word'
  if (uploading) {
    text = 'uploading'
  }

  return (
    <StyledUpload
      componentType={componentType}
      accept=".docx"
      id={bookComponentId}
      uploading={uploading}
      disabled={uploading || isLocked()}
      label={text}
      onChange={handleFileUpload}
    />
  )
}

export default UploadFileButton
