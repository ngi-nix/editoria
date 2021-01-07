import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

import NavBarGroup from './NavBarGroup'
import NavBarLink from './NavBarLink'

const Root = styled.nav`
  align-items: center;
  box-shadow: 0 0 1px ${th('colorText')};
  display: flex;
  height: calc(${th('gridUnit')} * 5.625);
  justify-content: space-between;
  padding: 0 ${grid(2)};
  width: 100%;
  z-index: 2;
`
const Brand = styled(NavBarLink)`
  margin-right: ${grid(2)};
`

const InnerContainer = styled.section`
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
  height: 100%;
`

const NavBar = ({ className, brand, itemsLeft, itemsRight }) => (
  <Root className={className}>
    <Brand to="/books">{brand}</Brand>
    <InnerContainer>
      <NavBarGroup items={itemsLeft} side="left" />
      <NavBarGroup items={itemsRight} side="right" />
    </InnerContainer>
  </Root>
)

export default NavBar
