import React from 'react'
import styled from 'styled-components'

import ModalRoot from './ModalRoot'
import ModalHeader from './ModalHeader'
import ModalFooterDialog from './ModalFooterDialog'

// Centers info message horizontally and vertically.
const Centered = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  text-align: center;
`

const DialogModal = props => {
  const { children, headerText, ...rest } = props

  const Header = <ModalHeader text={headerText} />
  const Footer = <ModalFooterDialog />

  return (
    <ModalRoot
      footerComponent={Footer}
      shouldCloseOnOverlayClick={false}
      headerComponent={Header}
      size="small"
      {...rest}
    >
      <Centered>{children}</Centered>
    </ModalRoot>
  )
}

export default DialogModal
