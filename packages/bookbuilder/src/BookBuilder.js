import React from 'react'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import styled from 'styled-components'

import {
  ProductionEditorsArea,
  TeamManagerButton,
  Header,
  UploadFilesButton,
  DownloadEpubButton,
  BookExporter,
  DivisionsArea,
} from './ui'

// import ConnectedTeamManager from './TeamManager/ConnectedTeamManager'

// import styles from './styles/bookBuilder.local.scss'

// TODO -- this doesn't work if imported in the css files. why?
// import './styles/fontAwesome.scss'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  width: 76%;
`
export class BookBuilder extends React.Component {
  constructor(props) {
    super(props)

    // this.toggleTeamManager = this.toggleTeamManager.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      outerContainer: this,
      showModal: false,
      // showTeamManager: false,
      uploading: {},
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  // toggleTeamManager() {
  //   this.setState({ showTeamManager: !this.state.showTeamManager })
  // }

  // renderTeamManagerModal() {
  //   const { outerContainer, showTeamManager } = this.state

  //   if (!showTeamManager) return null

  //   const { book } = this.props

  //   return (
  //     <ConnectedTeamManager
  //       book={book}
  //       container={outerContainer}
  //       show={showTeamManager}
  //       toggle={this.toggleTeamManager}
  //     />
  //   )
  // }

  render() {
    const {
      book,
      history,
      addBookComponent,
      addBookComponents,
      deleteBookComponent,
      updateBookComponentPagination,
      updateBookComponentOrder,
      updateBookComponentWorkflowState,
      updateBookComponentUploading,
      updateBookComponentContent,
      updateComponentType,
      onDeleteBookComponent,
      exportBook,
      onTeamManager,
      loading,
    } = this.props
    if (loading) return 'Loading...'
    const { divisions, productionEditors } = book
    const { outerContainer } = this.state
    // const teamManagerModal = this.renderTeamManagerModal()
    const productionEditorActions = [
      // <Authorize object={book.id} operation="can view teamManager">
      <TeamManagerButton label="Team Manager" onClick={()=>onTeamManager(book.id)} />,

      /* </Authorize>, */
    ]
    const headerActions = [
      // <Authorize object={book.id} operation="can view multipleFilesUpload">
      <UploadFilesButton
        book={book}
        create={addBookComponents}
        divisions={divisions}
        update={updateBookComponentContent}
        updateUploadStatus={updateBookComponentUploading}
      />,
      // </Authorize>,
      <BookExporter
        book={book}
        history={history}
        htmlToEpub={exportBook}
        outerContainer={outerContainer}
        showModal={this.state.showModal}
        showModalToggle={this.toggleModal}
      />,
      <DownloadEpubButton
        book={book}
        htmlToEpub={exportBook}
        outerContainer={outerContainer}
        showModal={this.state.showModal}
        showModalToggle={this.toggleModal}
      />,
    ]
    return (
      <Container>
        <ProductionEditorsArea
          actions={productionEditorActions}
          productionEditors={productionEditors}
        />
        <Header bookTitle={book.title} actions={headerActions} />
        <DivisionsArea
          addBookComponent={addBookComponent}
          addBookComponents={addBookComponents}
          history={history}
          bookId={book.id}
          deleteBookComponent={deleteBookComponent}
          onDeleteBookComponent={onDeleteBookComponent}
          divisions={divisions}
          outerContainer={outerContainer}
          showModal={this.state.showModal}
          showModalToggle={this.toggleModal}
          updateBookComponentContent={updateBookComponentContent}
          updateBookComponentOrder={updateBookComponentOrder}
          updateBookComponentPagination={updateBookComponentPagination}
          updateBookComponentUploading={updateBookComponentUploading}
          updateBookComponentWorkflowState={updateBookComponentWorkflowState}
          updateComponentType={updateComponentType}
        />
      </Container>
    )
  }
}

export default BookBuilder
