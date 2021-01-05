import React, { Fragment } from 'react'
import styled from 'styled-components'
import DashboardHeader from './DashboardHeader'
import BookList from './BookList'
import Loading from '../../../ui/Loading'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 100%;
  height: 100%;
`
const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
  height: calc(100% - 72px);
`
const Dashboard = ({
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
}) => {
  if (loading || loadingRules) return <Loading vertical="center" />

  return (
    <Container>
      {collections.map(collection => (
        <Fragment>
          <DashboardHeader
            canAddBooks={rules.canAddBooks}
            collectionId={collection.id}
            onAddBook={onAddBook}
            onChangeSort={onChangeSort}
            title={collection.title}
          />
          <InnerWrapper>
            <BookList
              archiveBook={archiveBook}
              bookRules={rules.bookRules}
              books={collection.books}
              loading={loading || loadingRules || refetching || refetchingRules}
              onArchiveBook={onArchiveBook}
              onDeleteBook={onDeleteBook}
              refetching={refetching}
              refetchingRules={refetchingRules}
              remove={deleteBook}
              renameBook={renameBook}
            />
          </InnerWrapper>
        </Fragment>
      ))}
    </Container>
  )
}

export default Dashboard
