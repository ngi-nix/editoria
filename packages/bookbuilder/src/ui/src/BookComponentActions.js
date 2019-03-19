import { get } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import DeleteModal from './DeleteModal'
import EditingNotification from './EditingNotification'
import { DefaultButton } from './Button'

const Container = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
`

const BookComponentActions = ({
  outerContainer,
  showModal,
  showModalToggle,
  componentType,
  uploading,
  bookComponentId,
  bookId,
  lock,
  history,
  remove,
  update,
}) => {
  const isLocked = get(lock, 'username')
  let deleteModal = null
  const goToEditor = () => {
    if (isLocked || uploading) return
    history.push(`/books/${bookId}/bookComponents/${bookComponentId}`)
  }
  if (showModal) {
    deleteModal = (
      <DeleteModal
        bookComponentId={bookComponentId}
        componentType={componentType}
        container={outerContainer}
        remove={remove}
        show={showModal}
        toggle={showModalToggle}
      />
    )
  }
  if (!isLocked) {
    return (
      <Container>
        <DefaultButton label="edit" onClick={goToEditor} disabled={uploading} />
        {/* <Separetor /> */}
        <DefaultButton
          label="delete"
          onClick={showModalToggle}
          disabled={uploading}
        />
        {deleteModal}
      </Container>
    )
  }
  return (
    <Container>
      <EditingNotification
        bookComponentId={bookComponentId}
        modalContainer={outerContainer}
        update={update}
        lock={lock}
        show={showModal}
        toggle={showModalToggle}
      />
    </Container>
  )
}

export default BookComponentActions
