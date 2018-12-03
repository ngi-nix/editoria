import React from 'react'
import { State } from 'react-powerplug'

import DashboardHeader from './DashboardHeader'
import BookList from './BookList'
import AddBookModal from './AddBookModal'

import styles from './dashboard.local.scss'

const Dashboard = props => {
  const { collections, createBook, deleteBook, loading, renameBook } = props

  if (loading) return 'Loading...'

  const className = `${
    styles.bookList
  } bootstrap pubsweet-component pubsweet-component-scroll`

  return (
    <div className={className}>
      <State initial={{ showModal: false, container: this }}>
        {({ state, setState }) => {
          const { showModal, container } = state
          const toggleModal = () => {
            setState({ showModal: !state.showModal })
          }

          return collections.map(collection => (
            <div className="container col-lg-offset-2 col-lg-8">
              <DashboardHeader title={collection.title} toggle={toggleModal} />

              <BookList
                books={collection.books}
                container={container}
                remove={deleteBook}
                renameBook={renameBook}
              />

              <AddBookModal
                collectionId={collection.id}
                container={container}
                create={createBook}
                show={showModal}
                toggle={toggleModal}
              />
            </div>
          ))
        }}
      </State>
    </div>
  )
}

export default Dashboard
