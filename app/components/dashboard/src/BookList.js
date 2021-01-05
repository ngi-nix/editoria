import { isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Loading from '../../../ui/Loading'

import Book from './Book'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const BookList = props => {
  const {
    books,
    loading,
    renameBook,
    remove,
    archiveBook,
    onDeleteBook,
    onArchiveBook,
    bookRules,
  } = props

  if (loading) return <Loading vertical="center" />

  if (isEmpty(books)) {
    return <div>There are no books to display.</div>
  }

  return (
    <Wrapper>
      {books.map(book => (
        <Book
          archiveBook={archiveBook}
          book={book}
          bookRule={bookRules.find(bookRule => bookRule.id === book.id)}
          key={book.id}
          onArchiveBook={onArchiveBook}
          onDeleteBook={onDeleteBook}
          remove={remove}
          renameBook={renameBook}
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
