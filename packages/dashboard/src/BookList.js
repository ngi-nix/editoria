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
  const { books, container, refetching, renameBook, remove } = props

  if (refetching) return 'Refetching...'

  if (isEmpty(books)) {
    return <div>There are no books to display.</div>
  }

  // TO DO: Delete this when the backend returns sorted results
  const items = sortBy(books, [book => book.title.toLowerCase()])

  return (
    <Wrapper>
      {items.map(book => (
        <Book
          book={book}
          container={container}
          key={book.id}
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
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default BookList
