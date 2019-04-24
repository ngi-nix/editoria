/* eslint-disable react/prop-types */

import React from 'react'
import styled from 'styled-components'

import { th } from '@pubsweet/ui-toolkit'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 calc(${th('gridUnit')} * 2) calc(${th('gridUnit')} * 2) calc(${th('gridUnit')} * 2);
`

const Footer = props => {
  const { className, children } = props
  return <Wrapper className={className}>{children}</Wrapper>
}

export default Footer
