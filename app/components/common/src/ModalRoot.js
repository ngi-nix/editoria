/* eslint-disable react/prop-types */

import React from 'react'
import ReactModal from 'react-modal'
import styled, { css } from 'styled-components'

import { th } from '@pubsweet/ui-toolkit'

import Body from './ModalBody'

ReactModal.setAppElement('#root')

/*
  This is to make react modal and styled components play nice
  See https://github.com/styled-components/styled-components/issues/1494#issuecomment-363362709
*/
function ReactModalAdapter({ className, modalClassName, ...props }) {
  return (
    <ReactModal
      className={modalClassName}
      closeTimeoutMS={150}
      portalClassName={className}
      {...props}
    />
  )
}

const large = css`
  bottom: 40px;
  left: 40px;
  right: 40px;
  top: 40px;
`

const largeNarrow = css`
  bottom: 40px;
  width: 940px;
  left: 25%;
  top: 40px;
`
const medium = css`
  height: 650px;
  top: 50%;
  left: 50%;
  margin-left: -470px;
  margin-top: -370px;
  width: 940px;
`
const mediumNarrow = css`
  height: 528px;
  top: 50%;
  left: 50%;
  margin-left: -376.5px;
  margin-top: -264px;
  width: 753px;
`
const small = css`
  height: 250px;
  left: 50%;
  margin-left: -250px;
  margin-top: -250px;
  top: 50%;
  width: 500px;
`

const StyledModal = styled(ReactModalAdapter).attrs({
  modalClassName: 'Modal',
  overlayClassName: 'Overlay',
})`
  .Overlay {
    background-color: rgba(240, 240, 240, 0.85);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }

  .Modal {
    background: ${th('colorBackground')};
    border: ${th('borderWidth')} ${th('borderStyle')} ${th('colorBorder')};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    outline: none;
    overflow: hidden;
    padding: 0;
    position: absolute;

    /* stylelint-disable order/properties-alphabetical-order */
    ${props => props.size === 'large' && large};
    ${props => props.size === 'largeNarrow' && largeNarrow};
    ${props => props.size === 'small' && small};
    ${props => props.size === 'medium' && medium};
    ${props => props.size === 'medium_narrow' && mediumNarrow};
    /* stylelint-enable order/properties-alphabetical-order */
  }

  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 150ms ease-in-out;
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
    z-index: 100000;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }
`

const ModalRoot = props => {
  const {
    children,
    className,
    footerComponent = null,
    headerComponent = null,
    onRequestClose,
    ...rest
  } = props

  if (!props.isOpen) return null
  return (
    <StyledModal
      className={className}
      onRequestClose={onRequestClose}
      {...rest}
    >
      {headerComponent &&
        React.cloneElement(headerComponent, {
          onRequestClose,
          ...rest,
        })}

      <Body>{children}</Body>

      {footerComponent &&
        React.cloneElement(footerComponent, {
          onRequestClose,
          ...rest,
        })}
    </StyledModal>
  )
}

export default ModalRoot
