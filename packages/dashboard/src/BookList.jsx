import { isEmpty, map, sortBy } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Book from './Book'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

class BookList extends React.Component {
  renderBookList() {
    const { books, container, renameBook, remove } = this.props

    if (!books) return 'Fetching...'

    if (isEmpty(books)) {
      return <div>There are no books to display.</div>
    }

    const items = sortBy(books, [book => book.title.toLowerCase()])

    const bookComponents = map(items, book => (
      <Book
        book={book}
        container={container}
        key={book.id}
        remove={remove}
        renameBook={renameBook}
      />
    ))

    return bookComponents
  }

  render() {
    const bookList = this.renderBookList()

    return <Wrapper>{bookList}</Wrapper>
  }
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  container: PropTypes.any.isRequired,
  remove: PropTypes.func.isRequired,
  renameBook: PropTypes.func.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default BookList
