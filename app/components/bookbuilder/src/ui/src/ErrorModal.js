import React from 'react'

import AbstractModal from '../../../../common/src/AbstractModal'

const ErrorModal = ({ container, show, toggle }) => {
  const body = (
    <div>
      An error occurred during the conversion to epub. Please try again later.
    </div>
  )
  const title = 'An error occurred'
  return (
    <AbstractModal
      body={body}
      container={container}
      show={show}
      title={title}
      toggle={toggle}
    />
  )
}

export default ErrorModal
