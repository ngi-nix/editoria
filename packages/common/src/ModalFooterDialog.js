/* eslint-disable react/prop-types */

import React, { Fragment } from 'react'
import styled from 'styled-components'

// import { Button } from '@pubsweet/ui'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'

import ModalFooter from './ModalFooter'

const Wrapper = styled(ModalFooter)`
  display: flex;
  justify-content: flex-end;
`

const ConfirmButton = styled.button`
  align-items: center;
  cursor: pointer;
  background: ${th('colorPrimary')};
  border: none;
  color: white;
  display: flex;
  margin-bottom:8px;
  padding: calc(${th('gridUnit')}/2) calc(3 * ${th('gridUnit')});
  /* border-bottom: 1px solid ${th('colorBackground')}; */
  &:disabled {
    background:#ccc;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background: ${lighten('colorPrimary', 10)};
  }
  &:not(:disabled):active {
    background: ${darken('colorPrimary', 10)};
    border: none;
    outline: none;
  }
  &:focus {
    background: ${darken('colorPrimary', 10)};
    outline: 0;
  }
`
const CancelButton = styled.button`
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  color: #828282;
  display: flex;
  padding: 0;
  border-bottom: 1px solid ${th('colorBackground')};
  &:disabled {
    background:#ccc;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
  }
  &:not(:disabled):active {
    border: none;
    color: ${th('colorPrimary')};
    outline: none;
    border-bottom: 1px solid ${th('colorPrimary')};
  }
  &:focus {
    outline: 0;
  }
`
const Label = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  font-weight: normal;
`

const ModalFooterDialog = props => {
  const {
    disableConfirm,
    onConfirm,
    onRequestClose,
    showCancelButton = true,
    textCancel = 'Cancel',
    textSuccess = 'OK',
    buttonLabel,
  } = props

  const shouldDisableCancel =
    disableConfirm &
    (buttonLabel === 'Validating' || buttonLabel === 'Generating')

  return (
    // <Wrapper className={className}>
    <ModalFooter>
      <ConfirmButton disabled={disableConfirm} onClick={onConfirm} primary>
        <Label>{buttonLabel || textSuccess}</Label>
      </ConfirmButton>
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
