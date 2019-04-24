// import { includes, some } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { State } from 'react-powerplug'
import { map } from 'lodash'

import BookTitle from './BookTitle'
import BookActions from './BookActions'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  width:100%;
  /* padding: 0 8px 0 8px; */
`

const TopRow = styled.div`
  font-family: 'Fira Sans Condensed';
  font-size: 14px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-left: ${({ archived }) => (archived ? '-26px' : 0)};
`

const Status = styled.span`
  color: ${props => (props.publicationDate !== null ? '#0964CC' : '#828282')};
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
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
  align-items: center;
  flex-basis:100%;
`
const ArchivedIndicator = styled.i`
  svg {
    height: 24px;
    margin-right: 4px;
    align-self: center;
    width: 24px;
    #folder {
      fill: #828282;
    }
  }
`
const icon = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect id="background" width="28" height="28" fill="white" />
    <path id="folderFill" d="M9 10H9.94478L12.5539 13.1288H19V17H9V10Z" />
    <path
      id="folder"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.6 18.1402C7.6 18.3222 7.7792 18.4706 8 18.4706H20C20.2208 18.4706 20.4 18.3222 20.4 18.1402V11.5714C20.4 11.3886 20.2208 11.2411 20 11.2411H14C13.76 11.2411 13.5328 11.1378 13.3808 10.9596L11.3008 8.52941H8C7.7792 8.52941 7.6 8.677 7.6 8.859V18.1402ZM20 20H8C6.8976 20 6 19.1657 6 18.1402V8.859C6 7.83353 6.8976 7 8 7H11.6808C11.92 7 12.148 7.10247 12.3 7.28065L14.3792 9.71165H20C21.1024 9.71165 22 10.5452 22 11.5714V18.1402C22 19.1657 21.1024 20 20 20Z"
    />
  </svg>
)

const Author = ({ author }) => <TopRowKeyValue key="author" value={author} />

const TopRowValues = ({ authors }) => {
  if (authors.length === 0)
    return (
      <TopRowValuesWrapper>
        <Author author="Unassigned" />
      </TopRowValuesWrapper>
    )

  return (
    <TopRowValuesWrapper>
      {map(authors, author => {
        if (!author.surname || !author.givenName) {
          return <Author author={author.username} />
        }
        return <Author author={`${author.givenName} ${author.surname}`} />
      })}
    </TopRowValuesWrapper>
  )
}

const Book = props => {
  const {
    book,
    bookRule,
    history,
    renameBook,
    archiveBook,
    onDeleteBook,
    onArchiveBook,
  } = props
  const { authors, publicationDate, archived } = book
  console.log('book', book)
  const { canRenameBooks, canDeleteBooks, canArchiveBooks } = bookRule

  return (
    <State initial={{ isRenaming: false, showModal: false }}>
      {({ state, setState }) => {
        const { isRenaming } = state

        // TO DO -- probably shouldn't be here
        const goToBookBuilder = () => {
          if (archived) return false
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

        let statusLabel
        if (publicationDate !== null) {
          if (archived) {
            statusLabel = 'published (archived)'
          } else {
            statusLabel = 'published'
          }
        } else {
          if (archived) {
            statusLabel = 'in progress (archived)'
          } else {
            statusLabel = 'in progress'
          }
        }

        return (
          <Wrapper>
            <TopRow archived={archived}>
              <Status publicationDate={publicationDate}>
                {archived && <ArchivedIndicator>{icon}</ArchivedIndicator>}
                {statusLabel}
              </Status>

              <TopRowValues authors={authors} />
            </TopRow>

            <MainRow>
              <BookTitle
                isRenaming={isRenaming}
                archived={archived}
                bookId={book.id}
                // onDoubleClick={goToBookBuilder}
                rename={rename}
                title={book.title}
              />

              <BookActions
                book={book}
                canRenameBooks={canRenameBooks}
                canDeleteBooks={canDeleteBooks}
                canArchiveBooks={canArchiveBooks}
                isRenaming={isRenaming}
                onClickRename={onClickRename}
                onClickSave={onClickSave}
                onDeleteBook={onDeleteBook}
                onArchiveBook={onArchiveBook}
                archiveBook={archiveBook}
              />
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
}

export default withRouter(Book)
