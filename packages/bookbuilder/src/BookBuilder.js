import { forEach, map } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { clone, findIndex } from 'lodash'
// import { bindActionCreators } from 'redux'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
// import { connect } from 'react-redux'

// TODO -- clean up this import
// import Actions from 'pubsweet-client/src/actions'

import DivisionList from './DivisionList'
import FileUploader from './FileUploader/FileUploader'
import DownloadEpub from './DownloadEpub/DownloadEpub'
import VivliostyleExporter from './ExportToVivliostyle/VivliostyleExporter'
import ConnectedTeamManager from './TeamManager/ConnectedTeamManager'

import styles from './styles/bookBuilder.local.scss'

// TODO -- this doesn't work if imported in the css files. why?
import './styles/fontAwesome.scss'

export class BookBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.toggleTeamManager = this.toggleTeamManager.bind(this)
    this.updateUploadStatus = this.updateUploadStatus.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    // this.renderDivision = this.renderDivision.bind(this)
    // this.onEndDrag = this.onEndDrag.bind(this)
    // this.onMove = this.onMove.bind(this)
    this.renderProductionEditors = this.renderProductionEditors.bind(this)

    this.state = {
      outerContainer: this,
      showModal: false,
      showTeamManager: false,
      uploading: {},
    }
  }
  componentDidMount() {
    this.props.subscribeToBookComponentOrderUpdated()
    this.props.subscribeToBookComponentAdded()
    this.props.subscribeToBookComponentDeleted()
    this.props.subscribeToBookComponentPaginationUpdated()
    this.props.subscribeToBookComponentWorkflowUpdated()
    this.props.subscribeToBookComponentTitleUpdated()
    this.props.subscribeToBookTeamMembersUpdated()
  }
  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  toggleTeamManager() {
    this.setState({ showTeamManager: !this.state.showTeamManager })
  }

  updateUploadStatus(status) {
    // this.setState({ uploading: status })
  }

  renderTeamManagerModal() {
    const { outerContainer, showTeamManager } = this.state

    if (!showTeamManager) return null

    const { teams, users, book } = this.props

    return (
      <ConnectedTeamManager
        book={book}
        container={outerContainer}
        show={showTeamManager}
        toggle={this.toggleTeamManager}
      />
    )
  }

  renderProductionEditors() {
    const { book } = this.props
    const { productionEditors } = book
    let names = ''
    let label = 'Production Editor:'

    if (productionEditors && productionEditors.length > 1) {
      label = 'Production Editors:'
      for (let i = 0; i < productionEditors.length; i += 1) {
        if (i !== productionEditors.length - 1) {
          names += `${productionEditors[i]}, `
        } else {
          names += `${productionEditors[i]}`
        }
      }
    } else if (productionEditors && productionEditors.length !== 0) {
      names = productionEditors[0]
    } else {
      names = 'Unassigned'
    }
    return `${label} ${names}`
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
      exportBook,
    } = this.props
    const { divisions } = book
    // console.log('bb', book)
    const { outerContainer } = this.state
    const teamManagerModal = this.renderTeamManagerModal()

    return (
      <div className="bootstrap modal pubsweet-component pubsweet-component-scroll">
        <div className={styles.bookBuilder}>
          {/* eslint-disable-next-line react/no-string-refs */}
          <div className={styles.universe}>
            <div className={`${styles.productionEditorContainer}`}>
              <span>{this.renderProductionEditors()}</span>
              <Authorize object={book.id} operation="can view teamManager">
                <button
                  className={styles.teamManagerBtn}
                  onClick={this.toggleTeamManager}
                >
                  <i className={styles.teamManagerIcon} />
                  team manager
                </button>
              </Authorize>
            </div>
            <div className={`${styles.headerContainer}`}>
              <div className={`${styles.bookTitleContainer}`}>
                <h1>{book.title}</h1>
              </div>
              <div className={`${styles.btnContainer}`}>
                <Authorize
                  object={book.id}
                  operation="can view multipleFilesUpload"
                >
                  <FileUploader
                    book={book}
                    create={addBookComponents}
                    divisions={divisions}
                    update={updateBookComponentContent}
                    updateUploadStatus={updateBookComponentUploading}
                  />
                </Authorize>
                <VivliostyleExporter
                  book={book}
                  history={history}
                  htmlToEpub={exportBook}
                  outerContainer={outerContainer}
                  showModal={this.state.showModal}
                  showModalToggle={this.toggleModal}
                />
                <DownloadEpub
                  book={book}
                  htmlToEpub={exportBook}
                  outerContainer={outerContainer}
                  showModal={this.state.showModal}
                  showModalToggle={this.toggleModal}
                />
              </div>
            </div>
            <DivisionList
              addBookComponent={addBookComponent}
              addBookComponents={addBookComponents}
              bookId={book.id}
              deleteBookComponent={deleteBookComponent}
              divisions={divisions}
              outerContainer={outerContainer}
              updateBookComponentContent={updateBookComponentContent}
              updateBookComponentOrder={updateBookComponentOrder}
              updateBookComponentPagination={updateBookComponentPagination}
              updateBookComponentUploading={updateBookComponentUploading}
              updateBookComponentWorkflowState={
                updateBookComponentWorkflowState
              }
            />
          </div>
        </div>
        <Authorize object={book.id} operation="can view teamManager">
          {teamManagerModal}
        </Authorize>
      </div>
    )
  }
}

BookBuilder.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  // error: React.PropTypes.string,
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      rev: PropTypes.string,
      teamType: PropTypes.shape({
        name: PropTypes.string,
        permissions: PropTypes.arrayOf(PropTypes.string),
      }),
      members: PropTypes.arrayOf(PropTypes.string),
      object: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
  ),
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ),
  // userRoles: React.PropTypes.array,
}

BookBuilder.defaultProps = {
  teams: null,
  user: null,
  users: null,
}

export default BookBuilder
