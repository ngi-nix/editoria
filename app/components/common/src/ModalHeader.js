/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'

// import { Icon } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

const Header = styled.div`
  /* box-shadow: 0 0 1px ${th('colorPrimary')}; */
  font-family: ${th('fontHeading')};
  /* margin-bottom: 1px; */
  padding-top: 4px;
  text-align: center;
  /* margin-top: 8px; */
  width: 100%;
  /* padding: ${th('gridUnit')} calc(${th('gridUnit')} * 2); */
`

const HeaderText = styled.div`
  color: #828282;
  display: inline-block;
  font-size: 18px;
  line-height: 20px;
  padding: 8px 0;
  /* text-transform: capitalize; */
`

// const IconWrapper = styled.div`
//   border-radius: 50%;
//   float: right;
//   margin-top: 8px;
//   transition: ${th('transitionDuration')} ${th('transitionTimingFunction')}
//     ${th('transitionDelay')};

//   &:hover {
//     background: ${th('colorBackgroundHue')};
//   }
// `

// const CloseIcon = props => (
//   <IconWrapper>
//     <Icon size={2} {...props}>
//       x
//     </Icon>
//   </IconWrapper>
// )

const ModalHeader = props => {
  // const { className, closeIcon = true, onRequestClose, text } = props
  const { className, text } = props

  return (
    <Header className={className}>
      <HeaderText>{text.toUpperCase()}</HeaderText>
      {/* {closeIcon && <CloseIcon onClick={onRequestClose} />} */}
    </Header>
  )
}

export default ModalHeader
