import React from 'react'
import styled from 'styled-components'

import ModalRoot from './ModalRoot'
import ModalHeader from './ModalHeader'

const Centered = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  text-align: center;
`

const CustomModal = props => {
  const { children, headerText, size, footerComponent, ...rest } = props

  const Header = <ModalHeader text={headerText} />

  return (
    <ModalRoot
      footerComponent={footerComponent || null}
      headerComponent={Header}
      size={size}
      {...rest}
    >
      {children}
    </ModalRoot>
  )
}

export default CustomModal
