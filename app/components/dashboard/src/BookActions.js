import React from 'react'
import styled, { css } from 'styled-components'

// import Authorize from 'pubsweet-client/src/helpers/Authorize'
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
  /* align-items: flex-end; */
  display: flex;
  flex-basis: 12%;
  justify-content: flex-end;
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

const renderEdit = bookId => {
  return <Action to={`/books/${bookId}/book-builder`}>Edit</Action>
}

const renderRename = (
  isRenaming,
  onClickRename,
  onClickSave,
  canRenameBooks,
) => {

  if (isRenaming && canRenameBooks) {
    return <Action onClick={onClickSave}>Save</Action>
  }

  return canRenameBooks && <Action onClick={onClickRename}>Rename</Action>
}

const renderRemove = (book, onDeleteBook, canDeleteBooks) => {
  const handleClick = () => {
    onDeleteBook(book.id, book.title)
  }

  return canDeleteBooks && <Action onClick={handleClick}>Delete</Action>
}

const renderArchive = (book, onArchiveBook, canArchiveBooks) => {
  const { archived } = book
  const handleClick = () => {
    onArchiveBook(book.id, book.title, archived)
  }
  const label = archived ? 'Unarchive' : 'Archive'
  return canArchiveBooks && <Action onClick={handleClick}>{label}</Action>
}
const Actions = props => {
  const {
    book,
    canDeleteBooks,
    canArchiveBooks,
    canRenameBooks,
    isRenaming,
    onClickRename,
    onClickSave,
    archiveBook,
    onDeleteBook,
    onArchiveBook,
  } = props
  const { archived, id } = book
  return (
    <ActionGroup>
      {!archived && renderEdit(id)}
      {!archived &&
        renderRename(isRenaming, onClickRename, onClickSave, canRenameBooks)}
      {renderArchive(book, onArchiveBook, canArchiveBooks)}
      {archived && renderRemove(book, onDeleteBook, canDeleteBooks)}
    </ActionGroup>
  )
}

export default Actions
