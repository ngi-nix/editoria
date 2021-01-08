import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import DialogModal from '../../../../../common/src/DialogModal'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const UnlockModal = props => {
  const { isOpen, hideModal, data } = props
  const { componentType, title, onConfirm } = data

  return (
    <DialogModal
      buttonLabel="Yes"
      headerText={`Unlock ${componentType}`}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onRequestClose={hideModal}
    >
      <Text>
        {`Are you sure you want to unlock this ${componentType} with title ${title ||
          'Untitled'}?`}
      </Text>
    </DialogModal>
  )
}

export default UnlockModal
