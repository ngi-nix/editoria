import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose, withProps } from 'recompose'
import styled from 'styled-components'
import { grid } from '@pubsweet/ui-toolkit'
import { NavBar, NavBarLink, Dropdown } from '../../../ui'

const StyledLogo = styled.img`
  display: block;
  height: ${grid(4)};
  width: ${grid(4)};
`
const navLinksBuilder = location => {
  const inDashboard =
    location.pathname.match(/books/g) &&
    !location.pathname.match(/bookComponents/g) &&
    !location.pathname.match(/book-builder/g)
  const inTemplates = location.pathname.match(/templates/g)

  const navLinksLeft = [
    <NavBarLink active={inDashboard} to="/books">
      Books
    </NavBarLink>,
    <NavBarLink active={inTemplates} to="/templates">
      Templates
    </NavBarLink>,
  ]

  return navLinksLeft
}
const Navigation = props => {
  const { currentUser, location, client, logoutUser } = props
  const dropdownItems = [{ link: '/profile', label: 'Profile' }]

  if (currentUser === null) return null

  if (currentUser && currentUser.admin) {
    dropdownItems.push({ link: '/globalTeams', label: 'Team Manager' })
  }
  const itemsLeft = navLinksBuilder(location)

  return (
    <NavBar
      brand={<StyledLogo alt="Editoria" src="/assets/editoria.png" />}
      itemsLeft={itemsLeft}
      itemsRight={
        <Dropdown
          client={client}
          currentUser={currentUser}
          dropdownItems={dropdownItems}
          logoutUser={logoutUser}
          title="User Menu dropdown"
        />
      }
    />
  )
}

export default compose(
  withRouter,
  withProps(props => ({
    logoutUser: client => {
      client.cache.reset()
      localStorage.removeItem('token')
      props.history.push('/login')
    },
  })),
)(Navigation)
