import React from 'react'
import styled from 'styled-components'

import { ActionButton } from '../ui'

const Input = styled.input`
  display: none !important;
`
const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
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
    <Wrapper>
      <ActionButton
        className={className}
        disabled={disabled}
        label={label}
        onClick={onClick}
        type="primary"
      />
      <Input
        accept={accept}
        id={`file-uploader-${id}`}
        multiple={multiple}
        onChange={onChange}
        type="file"
      />
    </Wrapper>
  )
}
export default UploadButton
