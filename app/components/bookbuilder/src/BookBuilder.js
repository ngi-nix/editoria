import React from 'react'
import styled from 'styled-components'
import { Loading, Button, Icons } from '../../../ui'
import {
  ProductionEditorsArea,
  Header,
  UploadFilesButton,
  DivisionsArea,
} from './ui'

const {
  metadataIcon,
  assetManagerIcon,
  bookExportIcon,
  bookSettingIcon,
  teamManagerIcon,
} = Icons
const Container = styled.div`
  clear: both;
  display: block;
  float: none;
  margin: 0 auto;
  height: calc(100% - 80px);
  width: 76%;
`

export class BookBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      outerContainer: this,
      showModal: false,
      uploading: {},
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

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
      onWarning,
      rules,
      loading,
      loadingRules,
      setState,
      onEndNoteModal,
      onWorkflowUpdate,
      onBookSettings,
    } = this.props

    if (loading || loadingRules || !book) return <Loading />
    const { canViewTeamManager, canViewMultipleFilesUpload } = rules
    const { divisions, productionEditors } = book

    const productionEditorActions = []

    const headerActions = [
      <Button
        icon={metadataIcon}
        key={0}
        label="Metadata"
        onClick={() => onMetadataAdd(book)}
        title="Metadata"
      />,
      <Button
        icon={assetManagerIcon}
        key={1}
        label="Asset Manager"
        onClick={() => onAssetManager(book.id)}
        title="Asset Manager"
      />,
      <Button
        icon={bookExportIcon}
        key={2}
        label="Export Book"
        onClick={() => onExportBook(book, book.title, history)}
        title="Export Book"
      />,
      <Button
        icon={bookSettingIcon}
        key={3}
        label="Book Settings"
        onClick={() => onBookSettings(book)}
        title="Book Settings"
      />,
    ]
    if (canViewTeamManager) {
      headerActions.unshift(
        <Button
          icon={teamManagerIcon}
          key={4}
          label="Team Manager"
          onClick={() => onTeamManager(book.id)}
          title="Team Manager"
        />,
      )
    }

    if (canViewMultipleFilesUpload) {
      headerActions.unshift(
        <UploadFilesButton
          book={book}
          key={5}
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
          onEndNoteModal={onEndNoteModal}
          onWarning={onWarning}
          onWorkflowUpdate={onWorkflowUpdate}
          refetching={refetching}
          refetchingBookBuilderRules={refetchingBookBuilderRules}
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
