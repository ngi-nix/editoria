import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const DeleteBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookTitle, onConfirm } = data
  return (
    <DialogModal
      isOpen={isOpen}
      headerText="Delete Book"
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <Text>
        {`Are you sure you want to delete the book with title ${bookTitle}?`}
      </Text>
    </DialogModal>
  )
}

export default DeleteBookModal