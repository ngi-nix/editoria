import { get } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
// import Authorize from 'pubsweet-client/src/helpers/Authorize'
// import DeleteModal from './DeleteModal'
import EditingNotification from './EditingNotification'
import { DefaultButton } from './Button'

const Container = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
`

const BookComponentActions = ({
  componentType,
  uploading,
  bookComponentId,
  onDeleteBookComponent,
  bookId,
  lock,
  history,
  title,
  onAdminUnlock,
}) => {
  const isLocked = get(lock, 'username')
  const handleClick = () => {
    onDeleteBookComponent(bookComponentId, componentType, title)
  }
  
  const goToEditor = () => {
    if (isLocked || uploading) return
    history.push(`/books/${bookId}/bookComponents/${bookComponentId}`)
  }
  if (!isLocked) {
    return (
      <Container>
        <DefaultButton label="edit" onClick={goToEditor} disabled={uploading} />
        {/* <Separetor /> */}
        <DefaultButton
          label="delete"
          onClick={handleClick}
          disabled={uploading}
        />
      </Container>
    )
  }
  return (
    <Container>
      <EditingNotification
        bookComponentId={bookComponentId}
        onAdminUnlock={onAdminUnlock}
        componentType={componentType}
        title={title}
        lock={lock}
      />
    </Container>
  )
}

export default BookComponentActions
