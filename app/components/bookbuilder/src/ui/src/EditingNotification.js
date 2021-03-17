import React from 'react'

import { Action as UIAction, ActionGroup as UIActionGroup } from '@pubsweet/ui'
import styled, { css } from 'styled-components'

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
  const { username, created } = lock
  // if (isAdmin === null || isAdmin === true) {
  //   message = 'locked'
  // } else {
  //   message = `locked`
  // }

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

  return (
    <ActionGroup>
      <Action onClick={() => goToEditor(true)}>Preview</Action>
      <Action
        disabled={!currentUser.admin}
        onClick={() => onAdminUnlock(bookComponentId, componentType, title)}
        title={hoverTitle}
      >
        {currentUser.admin ? 'Unlock' : 'Locked'}
      </Action>
    </ActionGroup>
  )
}

export default EditingNotification
