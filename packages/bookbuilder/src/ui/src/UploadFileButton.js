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
      url: 'http://localhost:3050/api/ink',
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
      })
  }

  let text = 'upload word'
  if (uploading) {
    text = 'uploading'
  }
  let modal
  if (isLocked) {
    modal = (
      <UploadWarningModal
        container={modalContainer}
        show={showModal}
        toggle={showModalToggle}
        type={componentType}
      />
    )
  }

  return (
    <React.Fragment>
      <StyledUpload
        accept=".docx"
        id={bookComponentId}
        uploading={uploading}
        disabled={uploading}
        label={text}
        onChange={handleFileUpload}
      />
      {modal}
    </React.Fragment>
  )
}

export default UploadFileButton
