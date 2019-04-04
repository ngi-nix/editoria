/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'

import { Button } from '@pubsweet/ui'

import ModalFooter from './ModalFooter'

const Wrapper = styled(ModalFooter)`
  display: flex;
  justify-content: flex-end;
`

const ModalFooterDialog = props => {
  const {
    className,
    onConfirm,
    onRequestClose,
    showCancelButton = true,
    textCancel = 'Cancel',
    textSuccess = 'OK',
  } = props

  return (
    <Wrapper className={className}>
      {showCancelButton && (
        <Button onClick={onRequestClose}>{textCancel}</Button>
      )}

      <Button onClick={onConfirm} primary>
        {textSuccess}
      </Button>
    </Wrapper>
  )
}

export default ModalFooterDialog
