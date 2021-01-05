import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

import NavBarLink from './NavBarLink'
import ActionButton from './ActionButton'

const Wrapper = styled.div`
  color: ${th('colorText')};
  display: flex;
  flex-direction: column;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  max-height: 240px;
  line-height: ${th('lineHeightBase')};
  width: 222px;
  box-shadow: ${th('boxShadow')};
  padding: ${grid(1)};
`

const Divider = styled.hr`
  background-color: ${th('colorFurniture')};
  width: 100%;
`
const MainArea = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`
const UserSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: ${grid(0.5)};
`
const LogoutSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Username = styled.div`
  width: 100%;
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
`
const UserInfo = styled.div`
  width: 100%;
  font-weight: bold;
`
const DropComponent = ({
  client,
  currentUser,
  dropdownItems,
  logoutUser,
  setIsOpen,
}) => {
  const { givenName, surname, username } = currentUser

  return (
    <Wrapper>
      <UserSection>
        <UserInfo>
          {givenName} {surname}
        </UserInfo>
        <Username>{username}</Username>
      </UserSection>
      <Divider />
      <MainArea>
        {dropdownItems.map(item => {
          const { link, label } = item
          return (
            <NavBarLink onClick={() => setIsOpen(false)} to={link}>
              {label}
            </NavBarLink>
          )
        })}
      </MainArea>
      <Divider />
      <LogoutSection>
        <ActionButton
          disabled={false}
          label="Logout"
          onClick={() => {
            setIsOpen(false)
            logoutUser(client)
          }}
          title="Logout"
        />
      </LogoutSection>
    </Wrapper>
  )
}

export default DropComponent
