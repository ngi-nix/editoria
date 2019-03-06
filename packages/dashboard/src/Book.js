// import { includes, some } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { State } from 'react-powerplug'
import { map, forEach } from 'lodash'

import RemoveBookModal from './RemoveBookModal'

import BookTitle from './BookTitle'
import BookActions from './BookActions'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  padding: 0 0 0 24px;
`

const TopRow = styled.div`
  font-family: 'Fira Sans Condensed';
  font-size: 14px;
  line-height: 16px;
`

const Status = styled.span`
  color: ${props => (props.publicationDate !== null ? '#0B65CB' : '#666')}
  text-transform: uppercase;
`

const TopRowKey = styled.span`
  color: #aaa;
  padding-right: 4px;
  text-transform: capitalize;
`

const TopRowValue = styled.span`
  color: #666;
  text-transform: capitalize;
`

const TopRowKeyValue = ({ key, value }) => (
  <React.Fragment>
    <TopRowKey>author</TopRowKey>
    <TopRowValue>{value}</TopRowValue>
  </React.Fragment>
)

const TopRowValuesWrapper = styled.div`
  display: inline-flex;
  padding-left: 8px;

  &::before {
    color: #aaa;
    content: '-';
    padding-right: 8px;
  }
`

const MainRow = styled.div`
  display: flex;
`

const Author = ({ author }) => <TopRowKeyValue key="author" value={author} />

const TopRowValues = ({ authors }) => {
  if (!authors) return null

  return (
    <TopRowValuesWrapper>
      {map(authors, author => {
        return <Author author={author.username} />
      })}
    </TopRowValuesWrapper>
  )
}

const Book = props => {
  const { book, container, history, renameBook, remove } = props
  const { authors, publicationDate } = book

  return (
    <State initial={{ isRenaming: false, showModal: false }}>
      {({ state, setState }) => {
        const { isRenaming, showModal } = state

        // TO DO -- probably shouldn't be here
        const goToBookBuilder = () => {
          const url = `/books/${book.id}/book-builder`
          history.push(url)
        }

        const onClickRename = () => {
          setState({ isRenaming: true })
        }

        const onClickSave = () => {
          // SUPER HACK -- Needs to be redesigned, but it works for now
          const el = document.getElementById('renameTitle')
          rename(el.value)
        }

        const rename = value => {
          renameBook({
            variables: {
              id: book.id,
              title: value,
            },
          })

          setState({ isRenaming: false })
        }

        const removeBook = () => {
          remove({
            variables: {
              id: book.id,
            },
          })
        }

        const toggleModal = () => {
          setState({ showModal: !showModal })
        }

        return (
          <Wrapper>
            <TopRow>
              <Status publicationDate={publicationDate}>
                {publicationDate !== null ? 'published' : 'in progress'}
              </Status>

              <TopRowValues authors={authors} />
            </TopRow>

            <MainRow>
              <BookTitle
                isRenaming={isRenaming}
                onDoubleClick={goToBookBuilder}
                rename={rename}
                title={book.title}
              />

              <BookActions
                book={book}
                isRenaming={isRenaming}
                onClickRename={onClickRename}
                onClickSave={onClickSave}
                toggleModal={toggleModal}
              />

              {showModal && (
                <RemoveBookModal
                  book={book}
                  container={container}
                  remove={removeBook}
                  show={showModal}
                  toggle={toggleModal}
                />
              )}
            </MainRow>
          </Wrapper>
        )
      }}
    </State>
  )
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
