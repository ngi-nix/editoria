import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

const Wrapper = styled.section`
  align-items: center;
  display: flex;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  justify-content: ${({ side }) =>
    side === 'left' ? '#flex-start' : 'flex-end'};
  line-height: ${th('lineHeightBase')};

  > a:not(:last-child) {
    margin-right: ${grid(1)};
  }
`

const NavBarGroup = ({ items }) => <Wrapper>{items}</Wrapper>

export default NavBarGroup
