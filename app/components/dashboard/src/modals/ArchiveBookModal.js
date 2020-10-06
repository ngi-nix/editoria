import React from 'react'
import styled from 'styled-components'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../common/src/DialogModal'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
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
      <Text>
        {`Are you sure you want to ${
          archived ? 'unarchive' : 'archive'
        } the book with title ${bookTitle}?`}
      </Text>
    </DialogModal>
  )
}

export default ArchiveBookModal
