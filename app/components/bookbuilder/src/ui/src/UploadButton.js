import React from 'react'
import styled from 'styled-components'
import { Button, Icons } from '../../../../../ui'

const { uploadIcon } = Icons

const Input = styled.input`
  display: none !important;
`

const UploadButton = ({
  onChange,
  multiple,
  accept,
  label,
  disabled,
  id,
  className,
}) => {
  const onClick = event => {
    event.preventDefault()
    document.getElementById(`file-uploader-${id}`).click()
  }

  return (
    <React.Fragment>
      <Button
        className={className}
        disabled={disabled}
        icon={uploadIcon}
        label={label}
        onClick={onClick}
        title={label}
      />
      <Input
        accept={accept}
        id={`file-uploader-${id}`}
        multiple={multiple}
        onChange={onChange}
        type="file"
      />
    </React.Fragment>
  )
}
export default UploadButton
