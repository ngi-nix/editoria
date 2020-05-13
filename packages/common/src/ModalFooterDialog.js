/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'

// import { Button } from '@pubsweet/ui'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'

import ModalFooter from './ModalFooter'

// const Wrapper = styled(ModalFooter)`
//   display: flex;
//   justify-content: flex-end;
// `

const ConfirmButton = styled.button`
  align-items: center;
  background: ${th('colorPrimary')};
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  margin-bottom:8px;
  padding: calc(${th('gridUnit')}/2) calc(3 * ${th('gridUnit')});
  /* border-bottom: 1px solid ${th('colorBackground')}; */
  &:disabled {
    background:#ccc;
    cursor: not-allowed;
  }
  &:focus {
    background: ${darken('colorPrimary', 10)};
    outline: 0;
  }
  &:not(:disabled):hover {
    background: ${lighten('colorPrimary', 10)};
  }
  &:not(:disabled):active {
    background: ${darken('colorPrimary', 10)};
    border: none;
    outline: none;
  }
`
const CancelButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  border-bottom: 1px solid ${th('colorBackground')};
  color: #828282;
  cursor: pointer;
  display: flex;
  padding: 0;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  &:focus {
    outline: 0;
  }
  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
  }
  &:not(:disabled):active {
    border: none;
    border-bottom: 1px solid ${th('colorPrimary')};
    color: ${th('colorPrimary')};
    outline: none;
  }
`
const Label = styled.span`
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBase')};
  font-weight: normal;
  line-height: ${th('lineHeightBase')};
`

const ModalFooterDialog = props => {
  const {
    disableConfirm,
    onConfirm,
    onRequestClose,
    showCancelButton = true,
    showConfirmButton = true,
    textCancel = 'Cancel',
    textSuccess = 'OK',
    buttonLabel,
  } = props

  const shouldDisableCancel =
    disableConfirm &&
    (buttonLabel === 'Validating' || buttonLabel === 'Generating')

  return (
    // <Wrapper className={className}>
    <ModalFooter>
      {showConfirmButton && (
        <ConfirmButton disabled={disableConfirm} onClick={onConfirm} primary>
          <Label>{buttonLabel || textSuccess}</Label>
        </ConfirmButton>
      )}
      {showCancelButton && (
        <CancelButton disabled={shouldDisableCancel} onClick={onRequestClose}>
          <Label>{textCancel}</Label>
        </CancelButton>
      )}
      {/* </Wrapper> */}
    </ModalFooter>
  )
}

export default ModalFooterDialog
