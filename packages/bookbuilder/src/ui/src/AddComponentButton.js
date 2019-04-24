import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { ButtonWithIcon } from './Button'

const StyledButton = styled(ButtonWithIcon)`
  margin: 0 calc(2 * ${th('gridUnit')}) 0 0 !important;
`

const AddComponentButton = ({ add, label, type }) => {
  const addComponent = () => {
    add(type)
  }
  const icon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Common/Icon/Add">
        <g id="Common/Icon-background">
          <rect width="28" height="28" fill="white" />
        </g>
        <g id="Union">
          <path
            d="M14.8 13.2H16.4C16.84 13.2 17.2 13.56 17.2 14C17.2 14.44 16.84 14.8 16.4 14.8H14.8V16.4C14.8 16.84 14.44 17.2 14 17.2C13.56 17.2 13.2 16.84 13.2 16.4V14.8H11.6C11.16 14.8 10.8 14.44 10.8 14C10.8 13.56 11.16 13.2 11.6 13.2H13.2V11.6C13.2 11.16 13.56 10.8 14 10.8C14.44 10.8 14.8 11.16 14.8 11.6V13.2Z"
            fill="#828282"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M14 6C9.5888 6 6 9.5888 6 14C6 18.4112 9.5888 22 14 22C18.4112 22 22 18.4112 22 14C22 9.5888 18.4112 6 14 6ZM14 20.4C10.4712 20.4 7.6 17.5288 7.6 14C7.6 10.4712 10.4712 7.6 14 7.6C17.5288 7.6 20.4 10.4712 20.4 14C20.4 17.5288 17.5288 20.4 14 20.4Z"
            fill="#828282"
          />
        </g>
      </g>
    </svg>
  )
  return <StyledButton onClick={addComponent} label={label} icon={icon} />
}
export default AddComponentButton
