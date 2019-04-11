import React from 'react'

import UnlockModal from './UnlockModal'
import { ButtonWithIcon, DefaultButton } from './Button'
import { th } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'

const StyledButton = styled(ButtonWithIcon)`
  background: black;
  span {
    font-size: 12px;
    line-height: 16px;
  }
  color: ${th('colorBackground')};
  svg {
    width: 16px;
    height: 16px;
    fill: ${th('colorBackground')};
  }

  &:disabled {
    color: ${th('colorBackground')};
    svg {
      fill: ${th('colorBackground')};
    }
  }

  &:not(:disabled):hover {
    background-color: black;
    cursor: pointer;
    color: ${th('colorBackground')};
    svg {
      fill: ${th('colorBackground')};
    }
  }
  &:not(:disabled):active {
    background-color: black;
    cursor: pointer;
    color: ${th('colorBackground')};
    outline: none;
    svg {
      fill: ${th('colorBackground')};
    }
  }
  &:focus {
    outline: 0;
  }
`
const EditingNotification = ({
  bookComponentId,
  currentUser,
  onAdminUnlock,
  lock,
  componentType,
  title,
}) => {
  const { givenName, surname, username, created, isAdmin } = lock
  const message = isAdmin
    ? 'admin is editing'
    : `${givenName} ${surname} is editing`
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
  console.log(currentUser, isAdmin)

  return (
    <React.Fragment>
      <StyledButton
        icon={icon}
        label={message}
        title={hoverTitle}
        onClick={() => onAdminUnlock(bookComponentId, componentType, title)}
        disabled={!currentUser.admin}
      />
    </React.Fragment>
  )
}

export default EditingNotification
