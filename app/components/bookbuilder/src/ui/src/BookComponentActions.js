import { get } from 'lodash'
import React from 'react'
import styled, { css } from 'styled-components'
import { Action as UIAction, ActionGroup as UIActionGroup } from '@pubsweet/ui'

import EditingNotification from './EditingNotification'

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
  transition: 0.2s ease !important;
  min-width: 51px;
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
  flex-basis: ${({ componentType, lock }) => {
    if (componentType === 'part') {
      if (!lock) {
        return '9.5%'
      }
      return '9.4%'
    }
    return '10%'
  }};
  /* componentType === 'part' ? '9.4%' : '10%'}; */
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
const Container = styled.div`
  display: flex;
  flex-basis: 10%;
  /* align-self: flex-end; */
  align-items: center;
  justify-content: center;
`

const BookComponentActions = ({
  componentType,
  currentUser,
  uploading,
  bookComponentId,
  onDeleteBookComponent,
  bookId,
  lock,
  history,
  title,
  onAdminUnlock,
  rules,
}) => {
  const { bookComponentStateRules, canViewDeleteAction } = rules
  const { canViewFragmentEdit } =
    bookComponentStateRules.find(
      bookComponentState =>
        bookComponentState.bookComponentId === bookComponentId,
    ) || {}

  const isLocked = get(lock, 'username')
  const handleClick = () => {
    onDeleteBookComponent(bookComponentId, componentType, title)
  }

  const goToEditor = (preview = undefined) => {
    if (uploading) return
    if (preview) {
      history.push(`/books/${bookId}/bookComponents/${bookComponentId}/preview`)
    } else {
      history.push(`/books/${bookId}/bookComponents/${bookComponentId}`)
    }
  }
  if (componentType === 'toc') return null
  if (!isLocked) {
    return (
      <ActionGroup componentType={componentType} lock={lock}>
        {componentType !== 'endnotes' && (
          <Action disabled={uploading} onClick={() => goToEditor()}>
            {canViewFragmentEdit ? 'Edit' : 'View'}
          </Action>
        )}
        <Action
          disabled={uploading || !canViewDeleteAction}
          onClick={handleClick}
        >
          Delete
        </Action>
      </ActionGroup>
    )
  }
  return (
    <Container>
      <EditingNotification
        bookComponentId={bookComponentId}
        componentType={componentType}
        currentUser={currentUser}
        goToEditor={goToEditor}
        lock={lock}
        onAdminUnlock={onAdminUnlock}
        title={title}
      />
    </Container>
  )
}

export default BookComponentActions
