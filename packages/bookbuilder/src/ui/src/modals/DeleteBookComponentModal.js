import React from 'react'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'

const DeleteBookComponentModal = props => {
  const { isOpen, hideModal, data } = props
  const { bookComponentId, componentType, title, deleteBookComponent } = data
  const handleClick = () => {
    deleteBookComponent({
      variables: {
        input: {
          id: bookComponentId,
          deleted: true,
        },
      },
    })
    hideModal()
  }
  return (
    <DialogModal
      isOpen={isOpen}
      headerText={`Delete ${componentType}`}
      onRequestClose={hideModal}
      onConfirm={handleClick}
    >
      <div>
        {`Are you sure you want to delete this ${componentType} with title ${title}?`}
      </div>
    </DialogModal>
  )
}

export default DeleteBookComponentModal
