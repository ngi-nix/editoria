import React from 'react'
import styled from 'styled-components'
import { ButtonWithIcon } from './Button'
import { th } from '@pubsweet/ui-toolkit'

const Input = styled.input`
  display: none !important;
`

const UploadButton = ({
  onChange,
  multiple,
  accept,
  label,
  disabled,
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
      <ButtonWithIcon
        className={className}
        icon={icon}
        label={label}
        onClick={onClick}
        disabled={disabled}
      />
      <Input
        accept={accept}
        id={`${id}-upload-btn`}
        multiple={multiple}
        type="file"
        onChange={onChange}
      />
    </React.Fragment>
  )
}
export default UploadButton
