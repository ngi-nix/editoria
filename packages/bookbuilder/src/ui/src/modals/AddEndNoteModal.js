import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'
import { th } from '@pubsweet/ui-toolkit'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const AddEndNoteModal = props => {
  const { isOpen, data } = props
  const { componentType, onConfirm, onHideModal } = data

  return (
    <DialogModal
      headerText={`Add ${componentType}`}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={onHideModal}
    >
      <Text>
        By creating a notes placeholder you will only be able to see templates
        with notes option set to endnotes
      </Text>
    </DialogModal>
  )
}

export default AddEndNoteModal
