import React from 'react'
import styled from 'styled-components'

import {
  ProductionEditorsArea,
  TeamManagerButton,
  Header,
  UploadFilesButton,
  DownloadEpubButton,
  MetadataButton,
  AssetManagerButton,
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
      onAssetManager,
      onAdminUnlock,
      refetching,
      refetchingBookBuilderRules,
      onTeamManager,
      onExportBook,
      onError,
      onWarning,
      rules,
      loading,
      loadingRules,
      setState,
      onEndNoteModal,
      onWorkflowUpdate,
      onBookSettings,
    } = this.props

    if (loading || loadingRules) return 'Loading...'
    const { canViewTeamManager, canViewMultipleFilesUpload } = rules
    const { divisions, productionEditors } = book

    const productionEditorActions = []

    const headerActions = [
      <MetadataButton key={0} book={book} onMetadataAdd={() => onMetadataAdd(book)} />,
      <AssetManagerButton onAssetManager={() => onAssetManager(book.id)} />,
      // <BookExporter
      //   book={book}
      //   history={history}
      //   htmlToEpub={exportBook}
      //   onError={onError}
      // />,
      <BookExporterButton
        key={1}
        onClick={() => onExportBook(book, book.title, history)}
        onError={onError}
      />,
      <BookSettingsButton
        key={2}
        label="Book Settings"
        onClick={() => onBookSettings(book)}
      />,
    ]
    if (canViewTeamManager) {
      headerActions.unshift(
        <TeamManagerButton
          key={3}
          label="Team Manager"
          onClick={() => onTeamManager(book.id)}
        />,
      )
    }

    if (canViewMultipleFilesUpload) {
      headerActions.unshift(
        <UploadFilesButton
          key={4}
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
          refetching={refetching}
          refetchingBookBuilderRules={refetchingBookBuilderRules}
          applicationParameter={applicationParameter}
          bookId={book.id}
          currentUser={currentUser}
          deleteBookComponent={deleteBookComponent}
          divisions={divisions}
          history={history}
          onAdminUnlock={onAdminUnlock}
          onDeleteBookComponent={onDeleteBookComponent}
          onEndNoteModal={onEndNoteModal}
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
