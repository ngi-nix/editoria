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
const WarningModal = props => {
  const { isOpen, hideModal, data } = props
  const { onConfirm, error } = data

  return (
    <DialogModal
      isOpen={isOpen}
      headerText="An error occurred!"
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <Text>{`${error}`}</Text>
    </DialogModal>
  )
}

export default WarningModal
