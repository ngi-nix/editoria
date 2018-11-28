import React from 'react'
import { State } from 'react-powerplug'

import DashboardHeader from './DashboardHeader'
import BookList from './BookList'
// import AddBookModal from './AddBookModal'

import styles from './dashboard.local.scss'

const Dashboard = props => {
  // console.log('KFJSLDJFLSDJLFJLKSDJ')
  const {
    collections,
    // addBook,
    // loading,
    // renameBook,
    deleteBook,
  } = props

  // if (loading) return spinner

  const editBook = () => {
    // console.log('edit book')
  }

  const className = `${
    styles.bookList
  } bootstrap pubsweet-component pubsweet-component-scroll`

  return (
    <div className={className}>
      <State initial={{ showModal: false }}>
        {(state, setState) => {
          // console.log(state)
          // const { showModal } = state
          const toggleModal = () => {
            setState({ showModal: !state.showModal })
          }

          collections.map(collection => (
            <div className="container col-lg-offset-2 col-lg-8">
              <DashboardHeader title={collection.title} toggle={toggleModal} />

              <BookList
                books={collection.books}
                container={this}
                edit={editBook}
                remove={deleteBook}
              />

              {/* <AddBookModal
                container={this}
                create={addBook}
                show={showModal}
                toggle={toggleModal}
              /> */}
            </div>
          ))
        }}
      </State>
    </div>
  )
}

export default Dashboard
