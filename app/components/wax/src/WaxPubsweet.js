import { isEmpty } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import config from 'config'
import Wax from 'wax-editor-react'
import WaxHeader from './WaxHeader'

import { Loading } from '../../../ui'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;
  width: 100%;
  .editor-wrapper {
    height: 88vh;
  }
`
export class WaxPubsweet extends React.Component {
  constructor(props) {
    super(props)

    this.save = this.save.bind(this)
    this.update = this.update.bind(this)
    this.renderWax = this.renderWax.bind(this)
    this.onUnload = this.onUnload.bind(this)
    this.unlock = this.unlock.bind(this)
    this.lock = this.lock.bind(this)
    this.handleAssetManager = this.handleAssetManager.bind(this)
  }

  componentDidMount() {
    const { editing, bookComponentId } = this.props
    if (editing === 'preview' || editing === 'selection') return
    window.addEventListener('beforeunload', this.onUnload)
    // this.setState({ hasLock: true })
    this.lock(bookComponentId)
  }

  componentWillReceiveProps(nextProps) {
    const {
      history,
      onUnlocked,
      lock: lockBefore,
      bookComponentId: bookComponentIdBefore,
    } = this.props
    const {
      lock: lockAfter,
      bookId,
      bookComponentId: bookComponentIdAfter,
    } = nextProps

    const onConfirm = () => {
      history.push(`/books/${bookId}/book-builder`)
    }

    if (
      lockBefore !== null &&
      lockAfter === null &&
      bookComponentIdAfter === bookComponentIdBefore
    ) {
      onUnlocked(
        'The admin just unlocked this book component!! You will be redirected back to the Book Builder.',
        onConfirm,
      )
    }
    // if (lock !== null && lockAfter === null) {
    //   onUnlocked(
    //     'The admin just unlocked this book component!! You will be redirected back to the Book Builder.',
    //     onConfirm,
    //   )
    // }
  }

  componentWillUnmount() {
    const { bookComponentId, editing } = this.props

    if (editing === 'preview' || editing === 'selection') return
    this.unlock(bookComponentId)
  }

  unlock(id) {
    const { unlockBookComponent, lock } = this.props
    if (lock) {
      // for the case where the admin unlocks the component
      unlockBookComponent({
        variables: {
          input: {
            id,
          },
        },
      })
    }
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
    const { bookComponentId, updateBookComponentContent } = this.props

    return updateBookComponentContent({
      variables: {
        input: {
          id: bookComponentId,
          content,
        },
      },
    })
  }

  handleAssetManager() {
    const { bookId, onAssetManager } = this.props
    return onAssetManager(bookId)
  }

  // fileUpload(file) {
  //   const { uploadFile } = this.props
  //   return new Promise((resolve, reject) => {
  //     uploadFile({
  //       variables: {
  //         file,
  //       },
  //     }).then(res => {
  //       resolve({ file: `/uploads${res.data.upload.url}` })
  //     })
  //   })
  // }

  update(patch) {
    const {
      bookComponentId,
      updateBookComponentTrackChanges,
      renameBookComponent,
      updateCustomTags,
      addCustomTags,
    } = this.props
    const { trackChanges, title, tags } = patch

    if (tags) {
      const addTags = tags.filter(tag => !tag.id)
      const updateTags = tags.filter(tag => tag.id)
      if (addTags.length > 0) {
        addCustomTags({
          variables: {
            input: addTags,
          },
        })
      }
      if (updateTags.length > 0) {
        updateCustomTags({
          variables: {
            input: updateTags,
          },
        })
      }
    }

    if (trackChanges !== undefined) {
      return updateBookComponentTrackChanges({
        variables: {
          input: {
            id: bookComponentId,
            trackChangesEnabled: trackChanges,
          },
        },
      })
    }

    if (title) {
      return renameBookComponent({
        variables: {
          input: {
            id: bookComponentId,
            title,
          },
        },
      })
    }

    return Promise.resolve()
  }

  onUnload(e) {
    e.preventDefault()
    delete e.returnValue
    const { bookComponentId } = this.props
    this.unlock(bookComponentId)
  }

  renderWax(editing) {
    const {
      divisionType,
      componentType,
      nextBookComponent,
      title,
      bookTitle,
      bookId,
      prevBookComponent,
      bookComponentId,
      content: storedContent,
      componentTypeOrder,
      trackChangesEnabled,
      checkSpell,
      history,
      user,
      tags,
    } = this.props
    const waxConfig = {
      layout: config.wax.layout,
      lockWhenEditing: config.wax.lockWhenEditing,
      theme: config.wax.theme,
      autoSave: config.wax.autoSave,
      menus: (
        config.wax[divisionType.toLowerCase()][componentType] ||
        config.wax[divisionType.toLowerCase()].default
      ).menus,
    }

    const { layout, autoSave, menus } = waxConfig

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
        translatedEditing = 'disabled'
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

    let content
    if (storedContent === null) {
      content = ''
    } else {
      content = storedContent
    }

    let chapterNumber
    if (componentType === 'chapter') {
      chapterNumber = componentTypeOrder
    }

    return (
      <Container>
        <WaxHeader
          bookId={bookId}
          bookTitle={bookTitle}
          id={bookComponentId}
          nextBookComponent={nextBookComponent}
          prevBookComponent={prevBookComponent}
          title={title}
        />
        <Wax
          assetManager={this.handleAssetManager}
          autoSave={autoSave === undefined ? false : autoSave}
          chapterNumber={chapterNumber}
          checkSpell={checkSpell}
          className="editor-wrapper"
          content={content}
          customTags={tags}
          editing={translatedEditing}
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
      return <Loading />

    return this.renderWax(editing)
  }
}

WaxPubsweet.defaultProps = {
  config: {
    layout: 'default',
    lockWhenEditing: false,
  },
  editing: 'full',
  history: null,
}

export default WaxPubsweet
