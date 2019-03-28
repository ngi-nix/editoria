import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose, withProps } from 'recompose'
import { AppBar, Action } from '@pubsweet/ui'
import styled from 'styled-components'

// TODO -- break into smaller components

const StyledNavBar = styled(AppBar)`
  position: sticky;
  width: 100%;
`
class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.collectionId = ''
    this.inEditor = null
    this.inPaged = null
  }

  // componentWillMount() {
  //   // console.log('sdfgsdfgsdfgsdfg')
  //   // this.shouldAddBookLink()
  // }

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

    this.inEditor = pathname.match(/bookComponents/g)
    this.inPaged = pathname.match(/pagedPreviewer\/paged/g)

    if (this.inEditor || this.inPaged) {
      const pathnameSplitted = pathname.split('/')
      this.collectionId = pathnameSplitted[2] // eslint-disable-line
    }
  }

  render() {
    const { logoutUser, currentUser, client } = this.props
    const links = [<Action to="/books">Books</Action>]

    if (currentUser === null) return null

    if (currentUser && currentUser.admin) {
      links.push(
        <Action to="/users">Users</Action>,
        <Action to="/globalTeams">Global Teams </Action>,
      )
    }

    if (this.inEditor || this.inPaged) {
      links.push(
        <Action to={`/books/${this.collectionId}/book-builder`}>
          Back to book
        </Action>,
      )
    }

    // TODO --  fix object properties underneath
    return (
      <StyledNavBar
        brand="Editoria"
        navLinkComponents={links}
        onLogoutClick={() => logoutUser(client)}
        user={currentUser}
      />
    )
  }
}

Navigation.propTypes = {
  client: PropTypes.any, // eslint-disable-line
  currentUser: PropTypes.any, // eslint-disable-line
  history: PropTypes.any.isRequired, // eslint-disable-line
  logoutUser: PropTypes.func.isRequired,
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
