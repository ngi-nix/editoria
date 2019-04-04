import { isEmpty, sortBy } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Book from './Book'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const BookList = props => {
  const {
    books,
    /* refetching, */ renameBook,
    remove,
    archiveBook,
    onDeleteBook,
    onArchiveBook,
  } = props

  // if (refetching) return 'Refetching...'

  if (isEmpty(books)) {
    return <div>There are no books to display.</div>
  }

  return (
    <Wrapper>
      {books.map(book => (
        <Book
          book={book}
          key={book.id}
          remove={remove}
          renameBook={renameBook}
          archiveBook={archiveBook}
          onDeleteBook={onDeleteBook}
          onArchiveBook={onArchiveBook}
        />
      ))}
    </Wrapper>
  )
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
