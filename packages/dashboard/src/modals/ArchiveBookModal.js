import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const ArchiveBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookTitle, onConfirm, archived } = data
  return (
    <DialogModal
      isOpen={isOpen}
      headerText={archived ? 'Unarchive Book' : 'Archive Book'}
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <div>
        {`Are you sure you want to ${
          archived ? 'unarchive' : 'archive'
        } the book with title ${bookTitle}?`}
      </div>
    </DialogModal>
  )
}

export default ArchiveBookModal
