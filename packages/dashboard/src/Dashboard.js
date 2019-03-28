import React, { Component, Fragment } from 'react'
// import { State } from 'react-powerplug'
import styled from 'styled-components'
import DashboardHeader from './DashboardHeader'
import BookList from './BookList'
import AddBookModal from './AddBookModal'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
`
export class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = { showModal: false }
    this.toggleModal = this.toggleModal.bind(this)
  }

  toggleModal() {
    const { showModal } = this.state
    this.setState({ showModal: !showModal })
  }

  render() {
    const {
      collections,
      archiveBook,
      createBook,
      deleteBook,
      loading,
      onChangeSort,
      refetching,
      renameBook,
    } = this.props

    const { showModal } = this.state
    if (loading) return 'Loading...'

    return (
      <Container>
        {collections.map(collection => (
          <Fragment>
            <DashboardHeader
              onChangeSort={onChangeSort}
              title={collection.title}
              toggle={this.toggleModal}
            />

            <BookList
              books={collection.books}
              container={this}
              refetching={refetching}
              remove={deleteBook}
              renameBook={renameBook}
              archiveBook={archiveBook}
            />

            <AddBookModal
              collectionId={collection.id}
              container={this}
              create={createBook}
              show={showModal}
              toggle={this.toggleModal}
            />
          </Fragment>
        ))}
      </Container>
    )
  }
}

export default Dashboard
