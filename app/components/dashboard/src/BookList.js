import { isEmpty } from 'lodash'
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
    refetching,
    refetchingRules,
    renameBook,
    remove,
    archiveBook,
    onDeleteBook,
    onArchiveBook,
    bookRules,
  } = props

  // if (refetching) return 'Refetching...'
  if (refetching || refetchingRules) return 'Refetching...'

  if (isEmpty(books)) {
    return <div>There are no books to display.</div>
  }

  return (
    <Wrapper>
      {books.map(book => (
        <Book
          archiveBook={archiveBook}
          book={book}
          key={book.id}
          remove={remove}
          renameBook={renameBook}
          onDeleteBook={onDeleteBook}
          onArchiveBook={onArchiveBook}
          bookRule={bookRules.find(bookRule => bookRule.id === book.id)}
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
}

export default BookList
