import React from 'react'
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

import ConnectedTeamManager from './TeamManager/ConnectedTeamManager'

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

    this.toggleTeamManager = this.toggleTeamManager.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      outerContainer: this,
      showModal: false,
      showTeamManager: false,
      uploading: {},
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  toggleTeamManager() {
    this.setState({ showTeamManager: !this.state.showTeamManager })
  }

  renderTeamManagerModal() {
    const { outerContainer, showTeamManager } = this.state

    if (!showTeamManager) return null

    const { book } = this.props

    return (
      <ConnectedTeamManager
        book={book}
        container={outerContainer}
        show={showTeamManager}
        toggle={this.toggleTeamManager}
      />
    )
  }

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
      exportBook,
      rules,
      loading,
    } = this.props
    // console.log(rules)
    if (loading) return 'Loading...'
    const { canViewTeamManager, canViewMultipleFilesUpload } = rules
    const { divisions, productionEditors } = book
    const { outerContainer } = this.state
    const teamManagerModal = this.renderTeamManagerModal()
    const productionEditorActions = []
    if (canViewTeamManager) {
      productionEditorActions.push(
        <TeamManagerButton
          label="Team Manager"
          onClick={this.toggleTeamManager}
        />,
      )
    }

    const headerActions = [
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

    if (canViewMultipleFilesUpload) {
      headerActions.unshift(
        <UploadFilesButton
          book={book}
          create={addBookComponents}
          divisions={divisions}
          update={updateBookComponentContent}
          updateUploadStatus={updateBookComponentUploading}
        />,
      )
    }

    return (
      <div className="bootstrap modal pubsweet-component pubsweet-component-scroll">
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
            divisions={divisions}
            outerContainer={outerContainer}
            rules={rules}
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
        {teamManagerModal}
      </div>
    )
  }
}

export default BookBuilder
