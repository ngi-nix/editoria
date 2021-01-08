import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import DialogModal from '../../../../../common/src/DialogModal'

const Text = styled.div`
  font-family: ${th('fontInterface')};
  text-align: center;
  margin-bottom: ${grid(3)};
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: ${th('colorText')};
`

const DeleteBookModal = props => {
  const { isOpen, hideModal, data } = props
  const { templateName, onConfirm } = data
  return (
    <DialogModal
      buttonLabel="Yes"
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
