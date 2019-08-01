import React from 'react'
import styled from 'styled-components'
import { ButtonWithIcon, ButtonWithoutLabel, DefaultButton } from './Button'
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
      {label && icon && (
        <ButtonWithIcon
          className={className}
          disabled={disabled}
          icon={icon}
          label={label}
          onClick={onClick}
        />
      )}
      {label && !icon && (
        <DefaultButton
          className={className}
          disabled={disabled}
          label={label}
          onClick={onClick}
        />
      )}
      {!label && (
        <ButtonWithoutLabel
          className={className}
          disabled={disabled}
          icon={icon}
          onClick={onClick}
        />
      )}
      <Input
        accept={accept}
        id={`${id}-upload-btn`}
        multiple={multiple}
        onChange={onChange}
        type="file"
      />
    </React.Fragment>
  )
}
export default UploadButton
