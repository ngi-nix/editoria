/* eslint-disable react/prop-types */

import React from 'react'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#root')

const PlainModal = props => {
  const { isOpen, onRequestClose } = props
  return (
    <ReactModal
      isOpen={isOpen}
      onAfterOpen={() => console.log('haha')}
      onRequestClose={() => console.log('haho')}
      contentLabel="Example Modal"
    >
      <h2>Hello</h2>
      <button onClick={onRequestClose}>close</button>
      <div>I am a modal</div>
    </ReactModal>
  )
}

export default PlainModal
