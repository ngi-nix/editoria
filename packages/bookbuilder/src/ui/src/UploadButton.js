import React from 'react'
import styled from 'styled-components'
import { ButtonWithIcon } from './Button'
import { th } from '@pubsweet/ui-toolkit'

const Input = styled.input`
  display: none !important;
`
const onClick = event => {
  event.preventDefault()
  document.getElementById('file-uploader').click()
}

const UploadButton = ({ onChange, multiple, accept, label, disabled }) => {
  const icon = (
    <svg
      fill="#000000"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
    </svg>
  )
  return (
    <React.Fragment>
      <ButtonWithIcon
        icon={icon}
        label={label}
        onClick={onClick}
        disabled={disabled}
      />
      <Input
        accept={accept}
        id="file-uploader"
        multiple={multiple}
        type="file"
        onChange={onChange}
      />
    </React.Fragment>
  )
}
export default UploadButton
