import React from 'react'
import styled from 'styled-components'
import { Button } from '../../../../../ui'

const Input = styled.input`
  display: none !important;
`

const UploadButton = ({
  onChange,
  multiple,
  accept,
  label,
  disabled,
  title,
  icon,
  id,
  className,
}) => {
  const onClick = event => {
    event.preventDefault()
    document.getElementById(`${id}-upload-btn`).click()
  }

  return (
    <React.Fragment>
      <Button
        className={className}
        disabled={disabled}
        icon={icon}
        label={label}
        onClick={onClick}
        title={title}
      />
      <Input
        accept={accept}
        id={`${id}-upload-btn`}
        multiple={multiple}
        onChange={onChange}
        onKeyPress={e => {
          e.key === 'Enter' && e.preventDefault()
        }}
        type="file"
      />
    </React.Fragment>
  )
}
export default UploadButton
