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
  id,
  className,
}) => {
  const onClick = event => {
    event.preventDefault()
    document.getElementById(`file-uploader-${id}`).click()
  }
  const icon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Common/Icon/Upload">
        <rect width="28" height="28" fill="white" />
        <g id="Common/Icon-background">
          <rect width="28" height="28" fill="white" />
        </g>
        <g id="Vector">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14.5658 13.9109C14.2578 13.5892 13.7594 13.5867 13.4442 13.9001L11.0442 16.3142C10.7266 16.6342 10.7178 17.1609 11.025 17.4925C11.3322 17.8234 11.8386 17.8342 12.1562 17.5134L13.2002 16.4634V21.1667C13.2002 21.6275 13.5586 22 14.0002 22C14.4418 22 14.8002 21.6275 14.8002 21.1667V16.5117L15.8346 17.5892C15.9906 17.7517 16.1954 17.8334 16.4002 17.8334C16.605 17.8334 16.8098 17.7517 16.9658 17.5892C17.2786 17.2634 17.2786 16.7367 16.9658 16.4109L14.5658 13.9109Z"
            fill="#828282"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.54 10.3708C17.884 8.38416 16.0648 7 14 7C11.936 7 10.1168 8.38416 9.46 10.3708C7.5088 10.6466 6 12.3933 6 14.4999C6 15.5174 6.3552 16.4966 7.0008 17.2574C7.2928 17.6016 7.7984 17.6358 8.1296 17.3308C8.4608 17.0249 8.492 16.4991 8.2 16.1533C7.8128 15.6983 7.6 15.1099 7.6 14.4999C7.6 13.1216 8.6768 12 10 12H10.08C10.4608 12 10.7896 11.72 10.8648 11.3308C11.1632 9.78748 12.4824 8.66665 14 8.66665C15.5184 8.66665 16.8368 9.78748 17.136 11.3308C17.2112 11.72 17.5392 12 17.92 12H18C19.3232 12 20.4 13.1216 20.4 14.4999C20.4 15.1099 20.1872 15.6983 19.8008 16.1533C19.508 16.4991 19.54 17.0249 19.8704 17.3308C20.0232 17.4708 20.212 17.5391 20.4 17.5391C20.6216 17.5391 20.8416 17.4433 21 17.2574C21.6448 16.4966 22 15.5174 22 14.4999C22 12.3933 20.4912 10.6466 18.54 10.3708Z"
            fill="#828282"
          />
        </g>
      </g>
    </svg>
  )
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
        id={`file-uploader-${id}`}
        multiple={multiple}
        type="file"
        onChange={onChange}
      />
    </React.Fragment>
  )
}
export default UploadButton
