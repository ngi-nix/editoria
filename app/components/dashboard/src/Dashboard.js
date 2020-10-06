import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import DashboardHeader from './DashboardHeader'
import BookList from './BookList'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 100%;
`
const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
`
export class Dashboard extends Component {
  render() {
    const {
      collections,
      archiveBook,
      rules,
      loadingRules,
      deleteBook,
      loading,
      onChangeSort,
      refetching,
      renameBook,
      refetchingRules,
      onAddBook,
      onDeleteBook,
      onArchiveBook,
    } = this.props

    if (loading || loadingRules) return 'Loading...'
    

    return (
      <Container>
        {collections.map(collection => (
          <Fragment>
            <DashboardHeader
              onChangeSort={onChangeSort}
              canAddBooks={rules.canAddBooks}
              collectionId={collection.id}
              title={collection.title}
              onAddBook={onAddBook}
            />
            <InnerWrapper>
              <BookList
                books={collection.books}
                bookRules={rules.bookRules}
                refetching={refetching}
                refetchingRules={refetchingRules}
                onDeleteBook={onDeleteBook}
                onArchiveBook={onArchiveBook}
                remove={deleteBook}
                renameBook={renameBook}
                archiveBook={archiveBook}
              />
            </InnerWrapper>
          </Fragment>
        ))}
      </Container>
    )
  }
}

export default Dashboard
