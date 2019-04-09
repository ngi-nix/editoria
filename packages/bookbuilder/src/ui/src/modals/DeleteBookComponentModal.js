import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const DeleteBookComponentModal = props => {
  const { isOpen, hideModal, data } = props
  const { componentType, title, onConfirm } = data
 
  return (
    <DialogModal
      isOpen={isOpen}
      headerText={`Delete ${componentType}`}
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <div>
        {`Are you sure you want to delete this ${componentType} with title ${title}?`}
      </div>
    </DialogModal>
  )
}

export default DeleteBookComponentModal
