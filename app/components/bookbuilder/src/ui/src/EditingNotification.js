import React from 'react'

import UnlockModal from './UnlockModal'
import { ButtonWithIcon, DefaultButton } from './Button'
import { th } from '@pubsweet/ui-toolkit'
import styled, { css } from 'styled-components'
import { Action as UIAction, ActionGroup as UIActionGroup } from '@pubsweet/ui'

const StyledButton = styled(ButtonWithIcon)`
  /* background: #828282; */
  span {
    font-size: 16px;
    line-height: 18px;
    padding:2px;
  }
  color: #828282; 
  svg {
    width: 16px;
    height: 16px;
    fill: #828282;
  }

  &:disabled {
    /* background: #828282; */
    svg {
      /* fill: ${th('colorBackground')}; */
    }
  }

  &:not(:disabled):hover {
    /* background-color: black; */
    cursor: pointer;
    /* color: ${th('colorBackground')}; */
    svg {
      /* fill: ${th('colorBackground')}; */
    }
  }
  &:not(:disabled):active {
    /* background-color: black; */
    cursor: pointer;
    /* color: ${th('colorBackground')}; */
    outline: none;
    svg {
      /* fill: ${th('colorBackground')}; */
    }
  }
  &:focus {
    outline: 0;
  }
`

const underlineFade = css`
  &:before {
    transition: 0.2s ease;
    opacity: 0;
  }

  &:hover:before {
    opacity: 1;
  }
`

const underlineAnimation = css`
  position: relative;

  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
  }

  &:before {
    content: '';
    background-color: #0d78f2;
    bottom: 0;
    display: block;
    height: 2px;
    left: 0;
    right: 0;
    margin: 0 8px;
    position: absolute;
    visibility: hidden;
  }

  &:hover:before {
    visibility: visible;
  }

  ${underlineFade};
`

const Action = styled(UIAction)`
  color: #0d78f2 !important;
  font-family: 'Fira Sans Condensed' !important;
  font-size: 16px;
  font-weight: normal;
  text-decoration: none !important;
  text-transform: none;
  min-width: 51px;
  transition: 0.2s ease !important;
  background: none !important;
  &:hover,
  &:focus,
  &:active {
    background: none;
    font-weight: normal;
    color: #0d78f2;
    text-decoration: underline;
    outline: 0;
  }
`

const ActionGroup = styled(UIActionGroup)`
  flex-basis: ${({ componentType }) =>
    componentType === 'part' ? '9.4%' : '10%'};
  align-items: center;
  justify-content: center;
  display: flex;
  flex-shrink: 0;
  /* margin-bottom: 12px;
  margin-left: 8px; */

  div {
    border-right: 2px solid #aaa;
    display: inline-block;
    padding: 0 8px;

    ${underlineAnimation};
  }

  > * {
    &:last-child {
      border-right: 0;
      padding-right: 0;

      &::before {
        margin-right: 0;
      }
    }
  }
`
const EditingNotification = ({
  bookComponentId,
  currentUser,
  onAdminUnlock,
  lock,
  componentType,
  goToEditor,
  title,
}) => {
  const { givenName, surname, username, created, isAdmin } = lock
  let message
  if (isAdmin === null || isAdmin === true) {
    message = 'locked'
  } else {
    message = `locked`
  }

  let hoverTitle

  const formatDate = timestamp => {
    const date = new Date(timestamp)

    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    let hours = date.getHours().toString()
    if (hours.length === 1) {
      hours = `0${hours}`
    }

    let minutes = date.getMinutes().toString()
    if (minutes.length === 1) {
      minutes = `0${minutes}`
    }

    const theDate = `${month}/${day}/${year}`
    const theTime = `${hours}:${minutes}`
    const formatted = `${theDate} ${theTime}`

    return formatted
  }

  if (created) {
    const date = formatDate(created)
    hoverTitle = `${username} has been editing since ${date}`
  }
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  )

  return (
    <ActionGroup>
      <Action onClick={goToEditor}>Preview</Action>
      <Action
        disabled={!currentUser.admin}
        title={hoverTitle}
        onClick={() => onAdminUnlock(bookComponentId, componentType, title)}
      >
        {currentUser.admin ? 'Unlock':'Locked'}
      </Action>
      {/* <StyledButton
        icon={icon}
        label={message}
        title={hoverTitle}
        onClick={() => onAdminUnlock(bookComponentId, componentType, title)}
        disabled={!currentUser.admin}
      /> */}
    </ActionGroup>
  )
}

export default EditingNotification
