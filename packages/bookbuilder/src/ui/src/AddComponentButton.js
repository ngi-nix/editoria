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
      fill="#000000"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  )
  return <StyledButton onClick={addComponent} label={label} icon={icon} />
}
export default AddComponentButton
