import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../common/src/DialogModal'

const Text = styled.div`
  font-family: ${th('fontInterface')};
  text-align: center;
  margin-bottom: ${grid(3)};
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: ${th('colorText')};
`
const ArchiveBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookTitle, onConfirm, archived } = data
  return (
    <DialogModal
      buttonLabel="Yes"
      headerText={archived ? 'Unarchive Book' : 'Archive Book'}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>
        {`Are you sure you want to ${
          archived ? 'unarchive' : 'archive'
        } the book with title ${bookTitle}?`}
      </Text>
    </DialogModal>
  )
}

export default ArchiveBookModal
