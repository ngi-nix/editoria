import {
  // each,
  // filter,
  find,
  get,
  // includes,
  // some,
  // union,
  debounce,
  // isEmpty,
} from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import withAuthsome from 'pubsweet-client/src/helpers/withAuthsome'
import Authorize from 'pubsweet-client/src/helpers/Authorize'

import Actions from 'pubsweet-client/src/actions'
import Wax from 'wax-editor-react'
// import { getFragment } from 'pubsweet-client/src/actions/fragments'

export class WaxPubsweet extends React.Component {
  constructor(props) {
    super(props)

    this.fileUpload = this.fileUpload.bind(this)
    this.save = this.save.bind(this)
    // this.unlock = this.unlock.bind(this)
    this.update = this.update.bind(this)
    this.handlePolling = this.handlePolling.bind(this)
    this.renderWax = this.renderWax.bind(this)

    this.stackUpdateData = []
    this.pollingInterval = null
    this.state = {
      editing: null,
      lockConflict: true,
      pollingIsLive: false,
    }
  }

  componentWillMount() {
    const { getCollections, getFragments, getTeams } = this.props.actions
    // const { fragment } = this.props

    getCollections().then(() => {
      const { book } = this.props
      getTeams().then(() => {
        getFragments(book).then(() => {})
      })
    })
  }

  componentWillUnmount() {
    // const { editing, lockConflict, pollingIsLive } = this.state
    // if (!lockConflict) {
    // if (this.shouldLock() && editing === 'full') this.unlock()
    // if (this.shouldLock() && editing === 'full') {
    // console.log('ha')
    clearInterval(this.pollingInterval)
    // if (!pollingIsLive && editing !== 'selection') {
    //   let dialog = confirm('Polling was not initiated, manual unlock will be performed')
    //   // this.unlock()
    // } else {
    //   clearInterval(this.pollingInterval)
    // }
    // }
    // }
  }

  // lock() {
  //   const { user, match } = this.props
  //   const { fragmentId } = match.params
  //   console.log('in lock')

  //   const patch = {
  //     id: fragmentId,
  //     lock: {
  //       editor: { username: user.username, userId: user.id },
  //       timestamp: new Date(),
  //     },
  //   }

  //   this.update(patch)
  // }

  // unlock() {
  //   const { fragment } = this.props

  //   const patch = {
  //     id: fragment.id,
  //     lock: null,
  //   }

  //   this.update(patch)
  // }

  renderWax(editing) {
    const { config, fragment, history, user } = this.props
    const { layout, autoSave, tools } = config

    // From editoria config, this is just for testing purposes

    let translatedEditing
    const mode = {
      trackChanges: {
        toggle: true,
        view: true,
        own: {
          accept: true,
          reject: true,
        },
        others: {
          accept: true,
          reject: true,
        },
      },
      styling: true,
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
    const content = get(fragment, 'source')
    const trackChanges = get(fragment, 'trackChanges')

    let chapterNumber
    if (get(fragment, 'subCategory') === 'chapter') {
      chapterNumber = get(fragment, 'number')
    }

    return (
      <Wax
        className="editor-wrapper"
        content={content}
        chapterNumber={chapterNumber}
        fileUpload={this.fileUpload}
        history={history}
        layout={layout}
        autoSave={autoSave === undefined ? false : autoSave}
        onSave={this.save}
        editing={translatedEditing}
        trackChanges={trackChanges}
        update={this.update}
        user={user}
        mode={mode}
        tools={tools}
      />
    )
  }
  // getEditingState() {
  //   const { fragment, user } = this.props

  //   if (!fragment || !user) return 'full'

  //   const roles = user.roles

  //   // Production editors and admins can always edit
  //   if (some(['admin', 'production-editor'], role => includes(roles, role))) {
  //     return 'full'
  //   }

  //   const { progress } = fragment

  //   // Copy editor can only edit when state workflow is 'Editing'
  //   const isCopyEditor = includes(roles, 'copy-editor')
  //   const isEditing = progress.edit === 1

  //   if (isCopyEditor && isEditing) return 'full'

  //   // Author can only edit when state workflow is 'Reviewing'
  //   const isAuthor = includes(roles, 'author')
  //   const isReviewing = progress.review === 1

  //   if (isAuthor && isReviewing) return 'full'

  //   return 'selection'
  // }

  // TODO -- Theoretically, we shouldn't lock when the editor is in read only
  // mode. This gets complicated however, as the user will be able to be add
  // comments, which will in turn affect the fragment.
  shouldLock() {
    const { config } = this.props
    return config.lockWhenEditing
  }

  handlePolling() {
    const { polling } = this.props.actions
    const { user, match, history } = this.props
    const { bookId, fragmentId } = match.params

    polling(bookId, fragmentId, user)
      .then(res => {
        this.setState({ pollingIsLive: true })
      })
      .catch(err => {
        this.setState({ pollingIsLive: true })
        if (err.message === 'Forbidden') {
          history.push(`/books/${bookId}/book-builder`)
        }
      })
  }

  render() {
    // const { config, fragment, history, user } = this.props
    const { fragment } = this.props
    // const { layout } = config
    const { editing, lockConflict, pollingIsLive } = this.state

    // TODO -- these won't change properly on fragment change
    // see trackChanges hack in mapStateToProps
    // const content = get(fragment, 'source')
    // const trackChanges = get(fragment, 'trackChanges')

    // let chapterNumber
    // if (get(fragment, 'subCategory') === 'chapter') {
    //   chapterNumber = get(fragment, 'number')
    // }
    if (!editing && lockConflict && !pollingIsLive) {
      return <p>Loading</p>
    }

    return (
      <Authorize
        object={fragment}
        operation="can toggle track changes"
        unauthorized={this.renderWax(editing)}
      >
        {this.renderWax(editing)}
      </Authorize>
    )
  }

  fileUpload(file) {
    const { fileUpload } = this.props.actions
    return fileUpload(file)
  }

  save(source) {
    const { fragment } = this.props

    const patch = {
      id: fragment.id,
      source,
      progress: fragment.progress,
    }

    const sourceBefore = fragment.source || ''
    const hasContentBefore = sourceBefore.trim().length > 0
    const hasContent = source.trim().length > 0
    if (!hasContentBefore && hasContent) {
      patch.progress.upload = 1
      patch.progress.file_prep = 0
    }
    return this.update(patch)
  }

  componentWillReceiveProps(nextProps) {
    const { authsome } = this.props
    if (nextProps.fragment !== this.props.fragment) {
      authsome
        .can(this.props.user.id, 'can interact with editor', nextProps.fragment)
        .then(res => {
          // For the case of admin as there is no granularity in authsome
          if (res === true) {
            this.setState({ editing: 'full' })
          } else {
            this.setState({ editing: res })
          }
        })
    }
  }
  componentWillUpdate(nextProps, nextState) {
    const { book, history, config } = this.props
    let { pollingTimer } = config

    if (pollingTimer === undefined) {
      pollingTimer = 1000
    }

    if (this.state.editing === null && nextState.editing) {
      if (
        this.shouldLock() &&
        (nextState.editing === 'full' ||
          nextState.editing === 'full_without_tc' ||
          nextState.editing === 'review')
      ) {
        this.pollingInterval = setInterval(this.handlePolling, pollingTimer)
        // this.lock()
      }
    }
    if (
      this.props.fragment &&
      this.props.fragment.lock !== null &&
      nextProps.fragment.lock === null
    ) {
      // console.log('old lock', this.props.fragment.lock)
      // console.log('new lock', nextProps.fragment.lock)
      history.push(`/books/${book.id}/book-builder`)
    }
  }

  update(patch) {
    const { actions, book, fragment, history } = this.props
    const { updateFragment } = actions

    // if (!patch.id) { patch.id = fragment.id }
    // return updateFragment(book, patch)

    this.stackUpdateData.push(patch)

    // TODO -- this is temporary but works
    // It should DEFINITELY be removed in the near future though
    debounce(() => {
      const patchData = this.stackUpdateData.reduce((acc, x) => {
        for (const key in x) acc[key] = x[key]
        return acc
      }, {})

      if (this.stackUpdateData.length > 0) {
        if (!patchData.id) {
          patchData.id = fragment.id
        }

        updateFragment(book, patchData).then(res => {
          // const { user, fragment } = this.props
          if (res.error) {
            // When you reload within the editor check if the same user has the lock
            // if (fragment.lock && user.id !== fragment.lock.editor.userId) {
            history.push(`/books/${book.id}/book-builder`)
            // }
          } else if (this.state.lockConflict !== false) {
            this.setState({ lockConflict: false })
          }
        })
      }
      this.stackUpdateData = []
    }, 100)()

    return Promise.resolve()
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

WaxPubsweet.defaultProps = {
  config: {
    layout: 'default',
    lockWhenEditing: false,
    pollingTimer: 1000,
  },
  editing: 'full',
  history: null,
}

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
const mapStateToProps = (state, { match }) => {
  const bookId = match.params.bookId
  const book = find(state.collections, c => c.id === bookId)

  const fragmentId = match.params.fragmentId
  const fragment = state.fragments[fragmentId]

  const user = state.currentUser.user

  return {
    book,
    fragment,
    user,
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
})

export default compose(
  withAuthsome(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(WaxPubsweet)
