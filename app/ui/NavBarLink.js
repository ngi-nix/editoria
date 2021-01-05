import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

const NavBarLink = styled(Link)`
  color: ${({ active }) => (active ? th('colorPrimary') : th('colorText'))};
  display: inline-block;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  text-decoration: none;
  padding: ${grid(0.5)};

  &:hover {
    color: ${th('colorPrimary')};
    background: ${th('colorBackgroundHue')};
  }

  &:link,
  &:visited {
    font-family: ${th('fontInterface')};
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
    text-decoration: none;
  }

  &:active,
  &:focus {
    color: ${th('colorPrimary')};
    font-family: ${th('fontInterface')};
    font-size: ${th('fontSizeBase')};
    font-weight: bold;
    line-height: ${th('lineHeightBase')};
    text-decoration: none;
  }
`

export default NavBarLink
