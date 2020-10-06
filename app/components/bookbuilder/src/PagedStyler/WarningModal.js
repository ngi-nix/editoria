import React from 'react'
import styled from 'styled-components'
import { th, lighten, darken } from '@pubsweet/ui-toolkit'

import DialogModal from '../../../common/src/DialogModal'
import ModalFooter from '../../../common/src/ModalFooter'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
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

const Footer = props => {
  const {
    saveCssAllBook,
    saveCssBook,
    onRequestClose,
    showCancelButton = true,
    textCancel = 'Cancel',
  } = props

  return (
    <ModalFooter>
      <ConfirmButton onClick={saveCssAllBook} primary>
        <Label>Modify</Label>
      </ConfirmButton>
      <ConfirmButton onClick={saveCssBook} primary>
        <Label>Create New</Label>
      </ConfirmButton>
      {showCancelButton && (
        <CancelButton onClick={onRequestClose}>
          <Label>{textCancel}</Label>
        </CancelButton>
      )}
    </ModalFooter>
  )
}

const WarningModal = props => {
  const { isOpen, hideModal, data } = props
  const { saveCssAllBook, saveCssBook, name } = data

  return (
    <DialogModal
      footerComponent={
        <Footer saveCssAllBook={saveCssAllBook} saveCssBook={saveCssBook} />
      }
      headerText="Modify Css"
      isOpen={isOpen}
      onRequestClose={hideModal}
      saveCssAllBook={saveCssAllBook}
      saveCssBook={saveCssBook}
    >
      <Text>
        {`Do you want to modify the css of template "${name}" or create a new Template for the specific book.`}
        <br />
      </Text>
    </DialogModal>
  )
}

export default WarningModal
