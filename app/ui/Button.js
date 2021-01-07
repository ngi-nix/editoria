import React from 'react'
import styled from 'styled-components'

import RootButton from './RootButton'

const StyledIcon = styled.i`
  height: 24px;
  width: 24px;
  display: block;
`
const Label = styled.span`
  ${props => props.hasIcon && `margin-left: 4px;`}
`

const Button = props => {
  const { active, className, disabled, title, label, icon, onClick } = props

  return (
    <RootButton
      active={active}
      className={className}
      disabled={disabled}
      label={label}
      onClick={onClick}
      title={title}
    >
      {icon && (
        <StyledIcon active={active} disabled={disabled}>
          {icon}
        </StyledIcon>
      )}
      {label && <Label hasIcon={!!icon}>{label}</Label>}
    </RootButton>
  )
}

Button.defaultProps = {
  title: null,
  label: null,
  icon: null,
}

export default Button
