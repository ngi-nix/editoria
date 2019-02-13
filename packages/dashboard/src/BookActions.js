import React from 'react'
import styled, { css } from 'styled-components'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { Action as UIAction, ActionGroup as UIActionGroup } from '@pubsweet/ui'

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
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #0d78f2;
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
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  text-decoration: none !important;
  text-transform: none;
  transition: 0.2s ease !important;

  &:hover,
  &:focus,
  &:active {
    background: none;
    color: #0d78f2;
    text-decoration: underline;
  }

  ${underlineAnimation};
`

const ActionGroup = styled(UIActionGroup)`
  align-items: flex-end;
  display: flex;
  flex-shrink: 0;
  margin-bottom: 7px;
  margin-left: 8px;

  div {
    border-right: 1px solid #0d78f2;
    display: inline-block;
    padding: 0 8px;
  }

  > * {
    &:last-child {
      border-right: 0;
      padding-right: 0;
    }
  }
`

const Edit = props => {
  const { bookId } = props
  return <Action to={`/books/${bookId}/book-builder`}>Edit</Action>
}

const Rename = props => {
  const { book, isRenaming, onClickRename, onClickSave } = props

  if (isRenaming) {
    return (
      <Authorize object={book} operation="can rename books">
        <Action onClick={onClickSave}>Save</Action>
      </Authorize>
    )
  }

  return (
    <Authorize object={book} operation="can rename books">
      <Action onClick={onClickRename}>Rename</Action>
    </Authorize>
  )
}

const Remove = props => {
  const { book, toggleModal } = props

  return (
    <Authorize object={book} operation="can delete books">
      <Action onClick={toggleModal}>Delete</Action>
    </Authorize>
  )
}

const Actions = props => {
  const { book, isRenaming, onClickRename, onClickSave, toggleModal } = props

  return (
    <ActionGroup>
      <Edit bookId={book.id} />

      <Rename
        book={book}
        isRenaming={isRenaming}
        onClickRename={onClickRename}
        onClickSave={onClickSave}
      />

      <Remove book={book} toggleModal={toggleModal} />
    </ActionGroup>
  )
}

export default Actions
