import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

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
      <div>{`${error}`}</div>
    </DialogModal>
  )
}

export default WarningModal
