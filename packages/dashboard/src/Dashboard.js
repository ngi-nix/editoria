import React, { Component } from 'react'
// import { State } from 'react-powerplug'

import DashboardHeader from './DashboardHeader'
import BookList from './BookList'
import AddBookModal from './AddBookModal'

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
      rules,
      createBook,
      deleteBook,
      loading,
      onChangeSort,
      refetching,
      renameBook,
    } = this.props

    const { showModal } = this.state
    if (loading) return 'Loading...'

    const className = `bootstrap pubsweet-component pubsweet-component-scroll`

    return collections.map(collection => (
      <div className={className}>
        <div className="container col-lg-offset-2 col-lg-8">
          <DashboardHeader
            onChangeSort={onChangeSort}
            canAddBooks={rules.canAddBooks}
            title={collection.title}
            toggle={this.toggleModal}
          />

          <BookList
            bookRules={rules.bookRules}
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
        </div>
      </div>
    ))
  }
}

export default Dashboard
