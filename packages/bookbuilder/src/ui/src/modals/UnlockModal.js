import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const UnlockModal = props => {
  const { isOpen, hideModal, data } = props
  const { componentType, title, onConfirm } = data
 
  return (
    <DialogModal
      isOpen={isOpen}
      headerText={`Unlock ${componentType}`}
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <div>
        {`Are you sure you want to unlock this ${componentType} with title ${title}?`}
      </div>
    </DialogModal>
  )
}

export default UnlockModal
