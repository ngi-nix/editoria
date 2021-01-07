import React from 'react'
import styled from 'styled-components'

import RootButton from './RootButton'

const StyledIcon = styled.i`
  height: 24px;
  width: 24px;
  display: block;
`
const StyledArrow = styled.i`
  height: 18px;
  width: 18px;
  display: block;
`
const userIcon = (
  <svg
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
  </svg>
)

const iconUp = (
  <svg
    fill="black"
    height="18px"
    viewBox="0 0 24 24"
    width="18px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
  </svg>
)

const iconDown = (
  <svg
    fill="black"
    height="18px"
    viewBox="0 0 24 24"
    width="18px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
)
const DropdownButton = props => {
  const { active, className, disabled, title, onClick } = props

  return (
    <RootButton
      active={active}
      className={className}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      <StyledIcon active={active} disabled={disabled}>
        {userIcon}
      </StyledIcon>

      {active ? (
        <StyledArrow active={active} disabled={disabled}>
          {iconUp}
        </StyledArrow>
      ) : (
        <StyledArrow active={active} disabled={disabled}>
          {iconDown}
        </StyledArrow>
      )}
    </RootButton>
  )
}

DropdownButton.defaultProps = {
  title: null,
}

export default DropdownButton
