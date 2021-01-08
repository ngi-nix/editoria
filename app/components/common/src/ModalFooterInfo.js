import React from 'react'

import { Button } from '../../../ui'

import ModalFooter from './ModalFooter'

const ModalFooterInfo = props => {
  const { onConfirm, textSuccess = 'OK', buttonLabel } = props

  return (
    <ModalFooter>
      <Button
        label={buttonLabel || textSuccess}
        onClick={onConfirm}
        title={buttonLabel || textSuccess}
      />
    </ModalFooter>
  )
}

export default ModalFooterInfo
