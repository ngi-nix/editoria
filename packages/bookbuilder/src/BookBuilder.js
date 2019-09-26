import React from 'react'
import styled from 'styled-components'

import {
  ProductionEditorsArea,
  TeamManagerButton,
  Header,
  UploadFilesButton,
  DownloadEpubButton,
  MetadataButton,
  // BookExporter,
  BookExporterButton,
  DivisionsArea,
  BookSettingsButton,
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
      applicationParameter,
      history,
      addBookComponent,
      onMetadataAdd,
      currentUser,
      deleteBookComponent,
      toggleIncludeInTOC,
      updateApplicationParameters,
      updateBookComponentPagination,
      updateBookComponentOrder,
      updateBookComponentWorkflowState,
      updateBookComponentUploading,
      updateComponentType,
      uploadBookComponent,
      onDeleteBookComponent,
      onAdminUnlock,
      exportBook,
      onTeamManager,
      onExportBook,
      onError,
      onWarning,
      rules,
      loading,
      loadingRules,
      setState,
      onWorkflowUpdate,
      onBookSettings,
    } = this.props

    if (loading || loadingRules) return 'Loading...'
    if (!book) return null
    const { canViewTeamManager, canViewMultipleFilesUpload } = rules
    const { divisions, productionEditors } = book

    const productionEditorActions = []

    const headerActions = [
      <MetadataButton book={book} onMetadataAdd={() => onMetadataAdd(book)} />,
      // <BookExporter
      //   book={book}
      //   history={history}
      //   htmlToEpub={exportBook}
      //   onError={onError}
      // />,
      <BookExporterButton
        onClick={() => onExportBook(book.id, book.title)}
        onError={onError}
      />,
      <BookSettingsButton
        label="Book Settings"
        onClick={() => onBookSettings(book)}
      />,
    ]
    if (canViewTeamManager) {
      headerActions.unshift(
        <TeamManagerButton
          label="Team Manager"
          onClick={() => onTeamManager(book.id)}
        />,
      )
    }

    if (canViewMultipleFilesUpload) {
      headerActions.unshift(
        <UploadFilesButton
          book={book}
          onWarning={onWarning}
          uploadBookComponent={uploadBookComponent}
          // updateUploadStatus={updateBookComponentUploading}
        />,
      )
    }

    return (
      <Container>
        <ProductionEditorsArea
          actions={productionEditorActions}
          productionEditors={productionEditors}
        />
        <Header actions={headerActions} bookTitle={book.title} />
        <DivisionsArea
          addBookComponent={addBookComponent}
          applicationParameter={applicationParameter}
          bookId={book.id}
          currentUser={currentUser}
          deleteBookComponent={deleteBookComponent}
          divisions={divisions}
          history={history}
          onAdminUnlock={onAdminUnlock}
          onDeleteBookComponent={onDeleteBookComponent}
          onWarning={onWarning}
          onWorkflowUpdate={onWorkflowUpdate}
          rules={rules}
          setState={setState}
          toggleIncludeInTOC={toggleIncludeInTOC}
          updateApplicationParameters={updateApplicationParameters}
          updateBookComponentOrder={updateBookComponentOrder}
          updateBookComponentPagination={updateBookComponentPagination}
          updateBookComponentUploading={updateBookComponentUploading}
          updateBookComponentWorkflowState={updateBookComponentWorkflowState}
          updateComponentType={updateComponentType}
          uploadBookComponent={uploadBookComponent}
        />
      </Container>
    )
  }
}

export default BookBuilder
