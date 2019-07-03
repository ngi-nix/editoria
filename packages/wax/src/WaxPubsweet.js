import { get, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import config from 'config'
import Wax from 'wax-editor-react'
import WaxHeader from './WaxHeader'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .editor-wrapper {
    height: 88vh;
  }
`

export class WaxPubsweet extends React.Component {
  constructor(props) {
    super(props)

    this.fileUpload = this.fileUpload.bind(this)
    this.save = this.save.bind(this)
    this.update = this.update.bind(this)
    this.renderWax = this.renderWax.bind(this)
    this.onUnload = this.onUnload.bind(this)
    this.unlock = this.unlock.bind(this)
    this.lock = this.lock.bind(this)
  }

  componentWillMount(nextProps) {
    const { bookComponentId, editing } = this.props
    if (editing === 'preview' || editing === 'selection') return
    this.lock(bookComponentId)
  }

  componentDidMount() {
    const { editing } = this.props
    if (editing === 'preview' || editing === 'selection') return
    window.addEventListener('beforeunload', this.onUnload)
  }

  componentWillReceiveProps(nextProps) {
    const { history, onUnlocked } = this.props
    const { bookComponent: bookComponentBefore, bookComponentId } = this.props
    const { lock: lockBefore } = bookComponentBefore
    const { bookComponent: bookComponentAfter } = nextProps
    const { lock: lockAfter, id: nextPropId } = bookComponentAfter

    const onConfirm = () => {
      history.push(`/books/${bookComponentAfter.bookId}/book-builder`)
    }

    if (
      lockBefore !== null &&
      lockAfter === null &&
      nextPropId === bookComponentId
    ) {
      onUnlocked(
        'The admin just unlocked this book component!! You will be redirected back to the Book Builder.',
        onConfirm,
      )
    }
  }

  componentWillUnmount() {
    const {
      bookComponent: { id },
      editing,
    } = this.props

    if (editing === 'preview' || editing === 'selection') return
    this.unlock(id)
  }

  unlock(id) {
    const { unlockBookComponent } = this.props
    unlockBookComponent({
      variables: {
        input: {
          id,
        },
      },
    })
    window.removeEventListener('beforeunload', this.onUnload)
  }

  lock(id) {
    const { lockBookComponent } = this.props
    lockBookComponent({
      variables: {
        input: {
          id,
        },
      },
    })
  }

  save(content) {
    const { bookComponent, updateBookComponentContent } = this.props
    const sourceBefore = bookComponent.content || ''
    const hasContentBefore = sourceBefore.trim().length > 0
    const hasContent = content.trim().length > 0
    let workflowStages

    if (!hasContentBefore && hasContent) {
      workflowStages = bookComponent.workflowStages.map(stage => ({
        label: stage.label,
        type: stage.type,
        value: stage.value,
      }))
      workflowStages[0].value = 1 // upload stage
      workflowStages[1].value = 0 // file_prep stage
      return updateBookComponentContent({
        variables: {
          input: {
            id: bookComponent.id,
            content,
            workflowStages,
          },
        },
      })
    }

    return updateBookComponentContent({
      variables: {
        input: {
          id: bookComponent.id,
          content,
        },
      },
    })
  }

  // TODO -- Theoretically, we shouldn't lock when the editor is in read only
  // mode. This gets complicated however, as the user will be able to be add
  // comments, which will in turn affect the fragment.
  shouldLock() {
    const { config } = this.props
    return config.lockWhenEditing
  }

  fileUpload(file) {
    const { uploadFile } = this.props
    return new Promise((resolve, reject) => {
      uploadFile({
        variables: {
          file,
        },
      }).then(res => {
        resolve({ file: `/uploads${res.data.upload.url}` })
      })
    })
  }

  update(patch) {
    const {
      bookComponent,
      updateBookComponentTrackChanges,
      renameBookComponent,
    } = this.props
    const { trackChanges, title } = patch

    if (trackChanges !== undefined) {
      return updateBookComponentTrackChanges({
        variables: {
          input: {
            id: bookComponent.id,
            trackChangesEnabled: trackChanges,
          },
        },
      })
    }

    if (title) {
      return renameBookComponent({
        variables: {
          input: {
            id: bookComponent.id,
            title,
          },
        },
      })
    }
    // const { actions, book, fragment, history } = this.props
    // const { updateFragment } = actions

    // // if (!patch.id) { patch.id = fragment.id }
    // // return updateFragment(book, patch)

    // this.stackUpdateData.push(patch)

    // // TODO -- this is temporary but works
    // // It should DEFINITELY be removed in the near future though
    // /* eslint-disable */
    // debounce(() => {
    //   const patchData = this.stackUpdateData.reduce((acc, x) => {
    //     for (const key in x) acc[key] = x[key]
    //     return acc
    //   }, {})

    //   if (this.stackUpdateData.length > 0) {
    //     if (!patchData.id) {
    //       patchData.id = fragment.id
    //     }

    //     updateFragment(book, patchData).then(res => {
    //       // const { user, fragment } = this.props
    //       if (res.error) {
    //         // When you reload within the editor check if the same user has the lock
    //         // if (fragment.lock && user.id !== fragment.lock.editor.userId) {
    //         history.push(`/books/${book.id}/book-builder`)
    //         // }
    //       } else if (this.state.lockConflict !== false) {
    //         this.setState({ lockConflict: false })
    //       }
    //     })
    //   }
    //   this.stackUpdateData = []
    // }, 100)()
    // /* eslint-enable */
    return Promise.resolve()
  }

  onUnload(event) {
    const { bookComponentId } = this.props
    this.unlock(bookComponentId)
  }

  renderWax(editing) {
    const { bookComponent, history, user } = this.props
    const waxConfig = {
      layout: config.wax.layout,
      lockWhenEditing: config.wax.lockWhenEditing,
      theme: config.wax.theme,
      autoSave: config.wax.autoSave,
      menus:
        config.wax[bookComponent.divisionType.toLowerCase()][
          bookComponent.componentType
        ].menus,
    }

    const { layout, autoSave, menus } = waxConfig
    // From editoria config, this is just for testing purposes

    let translatedEditing
    const mode = {
      trackChanges: {
        toggle: true,
        view: true,
        color: '#fff',
        own: {
          accept: true,
          reject: true,
        },
        others: {
          accept: true,
          reject: true,
        },
      },
      styling: true, // isAuthor
    }

    switch (editing) {
      case 'selection':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = true
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = false
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'selection'
        break
      case 'preview':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = false
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = false
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'selection'
        break
      case 'selection_without_tc':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = false
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = false
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'selection'
        break
      case 'review':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = true
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = true
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'full'
        break
      case 'full_without_tc':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = false
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = true
        mode.trackChanges.others.reject = false
        mode.styling = true
        translatedEditing = 'full'
        break
      default:
        mode.trackChanges.toggle = true
        mode.trackChanges.view = true
        mode.trackChanges.own.accept = true
        mode.trackChanges.own.reject = true
        mode.trackChanges.others.accept = true
        mode.trackChanges.others.reject = true
        mode.styling = true
        translatedEditing = 'full'
        break
    }

    // TODO -- these won't change properly on fragment change
    // see trackChanges hack in mapStateToProps
    // const content = get(bookComponent, 'content')
    let { content } = bookComponent

    if (content === null) {
      content = ''
    }
    const trackChangesEnabled = get(bookComponent, 'trackChangesEnabled')

    let chapterNumber
    if (get(bookComponent, 'componentType') === 'chapter') {
      chapterNumber = get(bookComponent, 'componentTypeOrder')
    }

    return (
      <Container>
        <WaxHeader bookComponent={bookComponent} />
        <Wax
          autoSave={autoSave === undefined ? false : autoSave}
          chapterNumber={chapterNumber}
          className="editor-wrapper"
          content={content}
          editing={translatedEditing}
          fileUpload={this.fileUpload}
          history={history}
          layout={layout}
          menus={menus}
          mode={mode}
          onSave={this.save}
          trackChanges={trackChangesEnabled}
          update={this.update}
          user={user}
        />
      </Container>
    )
  }

  render() {
    const { loading, waxLoading, teamsLoading, editing } = this.props

    if (loading || waxLoading || teamsLoading || isEmpty(config))
      return 'Loading...'

    return this.renderWax(editing)
  }
}

// TODO -- review required props
WaxPubsweet.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  fragment: PropTypes.shape({
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
  }).isRequired,
  history: PropTypes.any,
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
}
/* eslint-disable */
WaxPubsweet.defaultProps = {
  config: {
    layout: 'default',
    lockWhenEditing: false,
    pollingTimer: 1000,
  },
  editing: 'full',
  history: null,
}
/* eslint-enable */

// const getRoles = (user, book) => {
//   const teams = filter(user.teams, t => {
//     return t.object.id === book.id
//   })

//   let roles = []
//   const addRole = role => {
//     roles = union(roles, [role])
//   }

//   if (user.admin) addRole('admin')

//   each(teams, team => {
//     const name = team.teamType.name
//     const modified = name
//       .trim()
//       .toLowerCase()
//       .replace(' ', '-')
//     addRole(modified)
//   })

//   return roles
// }

export default WaxPubsweet // withAuthsome()
