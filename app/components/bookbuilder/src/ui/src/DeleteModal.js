import React from 'react'
import Modal from '../../../../common/src/Modal'

const DeleteModal = ({
  bookComponentId,
  container,
  remove,
  componentType,
  show,
  toggle,
}) => {
  const onDelete = () => {
    remove(bookComponentId)
    toggle()
  }
  return (
    <Modal
      action="delete"
      bookComponentId={bookComponentId}
      container={container}
      show={show}
      successAction={onDelete}
      successText="Delete"
      title={`Delete ${componentType}`}
      toggle={toggle}
      type={componentType}
    />
  )
}
export default DeleteModal
