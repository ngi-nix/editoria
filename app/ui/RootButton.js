import styled, { css } from 'styled-components'

import { th, grid } from '@pubsweet/ui-toolkit'

const activeStyles = css`
  color: ${th('colorPrimary')};

  > i svg {
    fill: ${th('colorPrimary')};
  }
`

const disabledStyles = css`
  cursor: not-allowed;
  opacity: 0.4;

  &:hover {
    background: none;
  }
`

const RootButton = styled.button.attrs(props => ({
  title: props.title,
  type: 'button',
}))`
  align-items: center;
  background: none;
  border: none;
  color: ${th('colorText')};
  cursor: pointer;
  display: flex;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  justify-content: center;
  outline: none;
  padding: ${grid(0.5)};
  transition: all 0.1s ease-in;

  > i svg {
    fill: ${th('colorText')};
    transition: all 0.1s ease-in;
  }

  &:hover {
    background: ${th('colorBackgroundHue')};
    color: ${th('colorPrimary')};

    > i svg {
      fill: ${th('colorPrimary')};
      transition: all 0.1s ease-in;
    }
  }

  /* stylelint-disable */
  ${props => props.active && activeStyles}
  ${props => props.disabled && disabledStyles}
`
export default RootButton
