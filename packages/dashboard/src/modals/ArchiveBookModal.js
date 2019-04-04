import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const ArchiveBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookId, bookTitle, archiveBook, archived } = data
  const handleClick = () => {
    archiveBook({
      variables: {
        id: bookId,
        archive: !archived,
      },
    })
    hideModal()
  }
  return (
    <DialogModal
      isOpen={isOpen}
      headerText="Archive Book"
      onRequestClose={hideModal}
      onConfirm={handleClick}
    >
      <div>
        {`Are you sure you want to archive the book with title ${bookTitle}?`}
      </div>
    </DialogModal>
  )
}

export default ArchiveBookModal
