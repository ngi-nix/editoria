import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Fira Sans Condensed';
  margin: 0 auto calc(7 * ${th('gridUnit')});
`
const Title = styled.div`
  border-bottom: calc(${th('gridUnit')} / 4) solid ${th('colorFurniture')};
  margin-bottom: calc(2 * ${th('gridUnit')});
  div {
    font-family: 'Vollkorn';
    font-size: ${th('fontSizeHeading2')};
    line-height: ${th('lineHeightHeading2')};
  }
`

const HeaderActions = styled.div`
  align-items: center;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`
const Header = ({ bookTitle, actions }) => {
  return (
    <HeaderContainer>
      <Title>
        <div>{bookTitle}</div>
      </Title>
      <HeaderActions>{actions}</HeaderActions>
    </HeaderContainer>
  )
}

export default Header
