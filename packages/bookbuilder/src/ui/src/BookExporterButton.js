import React from 'react'
import config from 'config'
import { ButtonWithIcon } from './Button'

const BookExporterButton = ({ onClick, onError }) => {
  const icon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Common/Icon/Book-v1">
        <rect width="28" height="28" fill="white" />
        <g id="Common/Icon-background">
          <rect width="28" height="28" fill="white" />
        </g>
        <g id="Vector">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22 20.4V8.60176L19.7739 7.9211C18.3121 7.47413 16.7874 7.49408 15.333 7.97922L13.4667 8.60176V20.4L15.0826 19.861C16.7014 19.321 18.3985 19.2988 20.0255 19.7963L22 20.4ZM20.9333 19.12V9.68141L19.2638 9.13688C18.1674 8.7793 17.0239 8.79527 15.9331 9.18338L14.5333 9.68141V19.12L15.7453 18.6888C16.9594 18.2568 18.2322 18.239 19.4525 18.637L20.9333 19.12Z"
            fill="#828282"
          />
          <path
            d="M13.4667 20.4V8.60176C11.76 7.26984 9.02199 7.63177 7.86632 7.97922L6 8.60176V20.4L7.61597 19.861C8.67731 19.5073 11.3333 19.12 13.4667 20.4Z"
            fill="#828282"
          />
        </g>
      </g>
    </svg>
  )

  return (
    <ButtonWithIcon icon={icon} label="Export Book" onClick={onClick} />
  )
}

export default BookExporterButton
