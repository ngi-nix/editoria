import React from 'react'
import styled from 'styled-components'

import {
  ProductionEditorsArea,
  TeamManagerButton,
  Header,
  UploadFilesButton,
  DownloadEpubButton,
  MetadataButton,
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
      state,
      history,
      addBookComponent,
      onMetadataAdd,
      addBookComponents,
      deleteBookComponent,
      updateBookComponentPagination,
      updateBookComponentOrder,
      updateBookComponentWorkflowState,
      updateBookComponentUploading,
      updateBookComponentContent,
      updateComponentType,
      onDeleteBookComponent,
      onAdminUnlock,
      exportBook,
      onTeamManager,
      onError,
      rules,
      loading,
      loadingRules,
      setState,
      refetchingBookBuilderRules,
      onWorkflowUpdate,
    } = this.props
    console.log(state)
    if (loading || loadingRules) return 'Loading...'
    if (!book) return null
    const { canViewTeamManager, canViewMultipleFilesUpload } = rules
    const { divisions, productionEditors } = book

    const productionEditorActions = []
    if (canViewTeamManager) {
      productionEditorActions.push(
        <TeamManagerButton
          label="Team Manager"
          onClick={() => onTeamManager(book.id)}
        />,
      )
    }

    const headerActions = [
      <MetadataButton book={book} onMetadataAdd={() => onMetadataAdd(book)} />,
      <BookExporter
        book={book}
        history={history}
        htmlToEpub={exportBook}
        onError={onError}
      />,
      <DownloadEpubButton
        book={book}
        htmlToEpub={exportBook}
        onError={onError}
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
      <Container>
        <ProductionEditorsArea
          actions={productionEditorActions}
          productionEditors={productionEditors}
        />
        <Header bookTitle={book.title} actions={headerActions} />
        <DivisionsArea
          addBookComponent={addBookComponent}
          onWorkflowUpdate={onWorkflowUpdate}
          addBookComponents={addBookComponents}
          setState={setState}
          onAdminUnlock={onAdminUnlock}
          history={history}
          bookId={book.id}
          deleteBookComponent={deleteBookComponent}
          onDeleteBookComponent={onDeleteBookComponent}
          divisions={divisions}
          rules={rules}
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
