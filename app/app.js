import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { hot } from 'react-hot-loader'

import createHistory from 'history/createBrowserHistory'

import { Root } from 'pubsweet-client'

// Modals
import AssetManager from './components/asset-manager/src/ConnectedAssetManager'
import ModalProvider from './components/common/src/ModalProvider'
import AddBookModal from './components/dashboard/src/modals/AddBookModal'
import AddEndNoteModal from './components/bookbuilder/src/ui/src/modals/AddEndNoteModal'
import DeleteBookModal from './components/dashboard/src/modals/DeleteBookModal'
import ArchiveBookModal from './components/dashboard/src/modals/ArchiveBookModal'
import DeleteBookComponentModal from './components/bookbuilder/src/ui/src/modals/DeleteBookComponentModal'
import BookTeamManagerModal from './components/bookbuilder/src/TeamManager/ConnectedTeamManager'
import WarningModal from './components/bookbuilder/src/ui/src/modals/WarningModal'
import WarningPagedJs from './components/bookbuilder/src/PagedStyler/WarningModal'
import ErrorModal from './components/bookbuilder/src/ui/src/modals/ErrorModal'
import UnlockModal from './components/bookbuilder/src/ui/src/modals/UnlockModal'
import ExportBookModal from './components/bookbuilder/src/ui/src/modals/ExportBookModal'
import MetadataModal from './components/bookbuilder/src/ui/src/modals/MetadataModal'
import WorkflowModal from './components/bookbuilder/src/ui/src/modals/WorkflowModal'
import BookSettingsModal from './components/bookbuilder/src/ui/src/modals/BookSettingsModal'
import UnlockedModal from './components/wax/src/modals/UnlockedModal'
import CreateTemplateModal from './components/templates/src/ui/src/modals/TemplateModal'
import UpdateTemplateModal from './components/templates/src/ui/src/modals/ConnectedUpdateTemplateModal'
import DeleteTemplateModal from './components/templates/src/ui/src/modals/DeleteTemplateModal'

import theme from './theme'

import routes from './routes'

const history = createHistory()
const modals = {
  addBook: AddBookModal,
  assetManagerModal: AssetManager,
  assetManagerEditor: AssetManager,
  addEndNote: AddEndNoteModal,
  deleteBook: DeleteBookModal,
  archiveBook: ArchiveBookModal,
  deleteBookComponent: DeleteBookComponentModal,
  bookTeamManager: BookTeamManagerModal,
  warningModal: WarningModal,
  warningPagedJs: WarningPagedJs,
  unlockModal: UnlockModal,
  metadataModal: MetadataModal,
  workflowModal: WorkflowModal,
  errorModal: ErrorModal,
  unlockedModal: UnlockedModal,
  createTemplateModal: CreateTemplateModal,
  updateTemplateModal: UpdateTemplateModal,
  deleteTemplateModal: DeleteTemplateModal,
  bookSettingsModal: BookSettingsModal,
  exportBookModal: ExportBookModal,
}
const rootEl = document.getElementById('root')
ReactDOM.render(
  <ModalProvider modals={modals}>
    <Root history={history} routes={routes} theme={theme} />
  </ModalProvider>,
  rootEl,
)

export default hot(module)(Root)
