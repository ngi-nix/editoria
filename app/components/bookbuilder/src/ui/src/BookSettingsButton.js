import React from 'react'
import { ButtonWithIcon } from './Button'

const BookSettingsButton = ({ onClick, label }) => {
  const icon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Common/Icon/Book-v2">
        <rect width="28" height="28" fill="white" />
        <g id="Common/Icon-background">
          <rect width="28" height="28" fill="white" />
        </g>
        <path
          id="Subtract"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.125 5H9.625C8.17775 5 7 6.27122 7 7.83333V19.1667C7 20.7288 8.17775 22 9.625 22H20.125C20.608 22 21 21.5769 21 21.0556V5.94444C21 5.42311 20.608 5 20.125 5ZM9.625 20.1111C9.14287 20.1111 8.75 19.6871 8.75 19.1667C8.75 18.6463 9.14287 18.2222 9.625 18.2222H19.25V20.1111H9.625ZM19.25 6.88889H9.625C9.14287 6.88889 8.75 7.31294 8.75 7.83333V16.5071C9.02475 16.4013 9.31613 16.3333 9.625 16.3333H19.25V6.88889Z"
          fill="#898989"
        />
      </g>
    </svg>
  )
  return <ButtonWithIcon onClick={onClick} label={label} icon={icon} />
}
export default BookSettingsButton
