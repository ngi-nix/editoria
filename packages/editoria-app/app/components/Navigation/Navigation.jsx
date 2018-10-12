import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavbarBrand } from 'react-bootstrap'
import { connect } from 'react-redux'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import NavbarUser from 'pubsweet-component-navigation/NavbarUser'
import actions from 'pubsweet-client/src/actions'

// TODO -- break into smaller components
class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.collectionId = ''
    this.inEditor = null
    this.inPaged = null
  }

  componentDidMount() {
    this.shouldAddBookLink()
  }

  componentWillUpdate() {
    this.shouldAddBookLink()
  }

  shouldAddBookLink() {
    const { history } = this.props
    const { location } = history
    const { pathname } = location

    this.collectionId = ''
    this.inEditor = null
    this.inPaged = null

    this.inEditor = pathname.match(/fragments/g)
    this.inPaged = pathname.match(/pagedPreviewer\/paged/g)
    if (this.inEditor || this.inPaged) {
      const pathnameSplited = pathname.split('/')
      this.collectionId = pathnameSplited[2]
    }
  }

  render() {
    const { logoutUser, currentUser } = this.props
    let logoutButtonIfAuthenticated

    if (currentUser.user === null) return null

    if (currentUser.isAuthenticated) {
      logoutButtonIfAuthenticated = (
        <NavbarUser
          user={currentUser.user}
          onLogoutClick={() => logoutUser('/login')}
        />
      )
    }

    let BackToBooks
    if (this.inEditor || this.inPaged) {
      BackToBooks = (
        <LinkContainer to={`/books/${this.collectionId}/book-builder`}>
          <NavItem>Back to book</NavItem>
        </LinkContainer>
      )
    }

    // TODO --  fix object properties underneath
    return (
      <Navbar fluid>
        <Navbar.Header>
          <NavbarBrand>
            <a href="/">Editoria</a>
          </NavbarBrand>
        </Navbar.Header>

        <Nav>
          <LinkContainer to="/books">
            <NavItem>Books</NavItem>
          </LinkContainer>

          <Authorize operation="can view nav links" object="users">
            <LinkContainer to="/users">
              <NavItem>Users</NavItem>
            </LinkContainer>
          </Authorize>

          {BackToBooks}
        </Nav>

        {logoutButtonIfAuthenticated}
      </Navbar>
    )
  }
}

Navigation.propTypes = {
  currentUser: PropTypes.any,
  history: PropTypes.any.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

export default withRouter(
  connect(
    state => ({
      currentUser: state.currentUser,
    }),
    {
      logoutUser: actions.logoutUser,
    },
  )(Navigation),
)
