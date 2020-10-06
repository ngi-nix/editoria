/* DEPRECATED */
/* eslint-disable */
import React from 'react'

import Modal from '../../../../../common/src/Modal'
const ProgressModal = ({
  changeProgressState,
  bookComponentId,
  componentType,
  container,
  show,
  toggle,
  modalType,
}) => {
  return (
    <Modal
      action={`workflow-warning-${modalType}`}
      bookComponentId={bookComponentId}
      container={container}
      show={show}
      successAction={changeProgressState}
      successText="OK"
      title="Change of workflow status"
      toggle={toggle}
      type={componentType}
    />
  )
}

export default ProgressModal
