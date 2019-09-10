import React from 'react'
import styled, { keyframes, css } from 'styled-components'

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
    return false
  }}
`

const UploadFileButton = ({
  bookComponentId,
  onWarning,
  updateBookComponentUploading,
  componentType,
  lock,
  uploading,
  uploadBookComponent,
}) => {
  const isLocked = () => {
    if (lock === null || lock === undefined) return false
    return true
  }
  const handleFileUpload = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const filename = file.name
    const extension = filename.split('.')[1]

    if (extension !== 'docx') {
      return onWarning(
        'This file extension is not supported by our system. Try to use only files with extension .docx',
      )
    }

    updateBookComponentUploading({
      variables: {
        input: {
          id: bookComponentId,
          uploading: true,
        },
      },
    })

    uploadBookComponent({
      variables: {
        bookComponentFiles: [
          {
            file,
            bookComponentId,
          },
        ],
      },
    })

    return true
  }

  let text = 'upload word'
  if (uploading) {
    text = 'uploading'
  }

  return (
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
}

export default UploadFileButton
