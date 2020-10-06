import React from 'react'

import Modal from '../../../../common/src/Modal'

const UnlockModal = ({
  chapter,
  container,
  show,
  toggle,
  componentType,
  bookComponentId,
  update,
}) => {
  const onUnlock = () => {
    const lock = null
    update(bookComponentId, lock)
    toggle()
  }

  return (
    <Modal
      action="unlock"
      chapter={chapter}
      container={container}
      show={show}
      successAction={onUnlock}
      successText="Unlock"
      title={`Unlock ${componentType}`}
      toggle={toggle}
      type={componentType}
    />
  )
}

export default UnlockModal
