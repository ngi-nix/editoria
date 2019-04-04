import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const DeleteBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookId, bookTitle, deleteBook } = data
  const handleClick = () => {
    deleteBook({
      variables: {
        id: bookId,
      },
    })
    hideModal()
  }
  return (
    <DialogModal
      isOpen={isOpen}
      headerText="Delete Book"
      onRequestClose={hideModal}
      onConfirm={handleClick}
    >
      <div>
        {`Are you sure you want to delete the book with title ${bookTitle}?`}
      </div>
    </DialogModal>
  )
}

export default DeleteBookModal
