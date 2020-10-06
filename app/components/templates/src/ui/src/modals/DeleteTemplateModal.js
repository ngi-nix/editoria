import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../../../common/src/DialogModal'

const Text = styled.div`
  color: #404040;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  text-align: center;
  width: 100%;
`
const DeleteBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { templateName, onConfirm } = data
  return (
    <DialogModal
      headerText="Delete Template"
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>
        {`Are you sure you want to delete the template with name ${templateName}?`}
      </Text>
    </DialogModal>
  )
}

export default DeleteBookModal
