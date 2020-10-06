import React from 'react'
import styled from 'styled-components'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'

import InfoModal from '../../../../../common/src/InfoModal'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const ErrorModal = props => {
  const { isOpen, hideModal, data } = props
  const { onConfirm, error } = data

  return (
    <InfoModal
      isOpen={isOpen}
      headerText="An error occurred!"
      onRequestClose={hideModal}
      onConfirm={onConfirm}
    >
      <Text>{`${error}`}</Text>
    </InfoModal>
  )
}

export default ErrorModal
