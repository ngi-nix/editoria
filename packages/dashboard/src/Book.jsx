// import { includes, some } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import RemoveBookModal from './RemoveBookModal'

import BookTitle from './BookTitle'
import BookActions from './BookActions'

const Wrapper = styled.div`
  display: flex;
  margin: 8px 0;
  padding: 0 0 0 24px;
`

// TODO -- Book and Chapter should both extend a common component
class Book extends React.Component {
  constructor(props) {
    super(props)

    this.goToBookBuilder = this.goToBookBuilder.bind(this)
    this.onClickRename = this.onClickRename.bind(this)
    this.onClickSave = this.onClickSave.bind(this)
    this.removeBook = this.removeBook.bind(this)
    this.rename = this.rename.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      isRenaming: false,
      showModal: false,
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  rename(value) {
    const { book, renameBook } = this.props

    renameBook({
      variables: {
        id: book.id,
        title: value,
      },
    })

    this.setState({
      isRenaming: false,
    })
  }

  goToBookBuilder() {
    const { book, history } = this.props
    const url = `/books/${book.id}/book-builder`
    history.push(url)
  }

  removeBook() {
    const { book, remove } = this.props
    remove({
      variables: {
        id: book.id,
      },
    })
  }

  onClickRename() {
    this.setState({
      isRenaming: true,
    })
  }

  onClickSave() {
    // SUPER HACK -- Needs to be redesigned, but it works for now
    const el = document.getElementById('renameTitle')
    this.rename(el.value)
  }

  renderRemoveModal() {
    const { book, container } = this.props
    const { showModal } = this.state
    if (!showModal) return null

    return (
      <RemoveBookModal
        book={book}
        container={container}
        remove={this.removeBook}
        show={showModal}
        toggle={this.toggleModal}
      />
    )
  }

  render() {
    const { isRenaming } = this.state
    const { book } = this.props
    const removeModal = this.renderRemoveModal()

    return (
      <Wrapper>
        <BookTitle
          isRenaming={isRenaming}
          onDoubleClick={this.goToBookBuilder}
          rename={this.rename}
          title={book.title}
        />

        <BookActions
          book={book}
          isRenaming={isRenaming}
          onClickRename={this.onClickRename}
          onClickSave={this.onClickSave}
          toggleModal={this.toggleModal}
        />

        {removeModal}
      </Wrapper>
    )
  }
}

Book.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  container: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  remove: PropTypes.func.isRequired,
  renameBook: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default withRouter(Book)
