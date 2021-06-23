import React, { useEffect, useState } from 'react'
import { isEqual, debounce } from 'lodash'
import styled from 'styled-components'
import { Wax } from 'wax-prosemirror-core'
import { EditoriaLayout } from '../layout'
import { configWax } from '../config'
import WaxHeader from './WaxHeader'
import usePrevious from './helpers'

const WaxContainer = styled.div`
  height: calc(100% - 72px);
  width: 100%;
`

const handleUnlock = (id, unlockBookComponent, setLocked) => {
  unlockBookComponent({
    variables: {
      input: {
        id,
      },
    },
  })
}

const handleLock = (id, lockBookComponent, setLocked) => {
  lockBookComponent({
    variables: {
      input: {
        id,
      },
    },
  })
}

const handleSave = (content, id, updateBookComponentContent) => {
  updateBookComponentContent({
    variables: {
      input: {
        id,
        content,
      },
    },
  })
}

const handleTitleUpdate = (title, id, renameBookComponent) => {
  renameBookComponent({
    variables: {
      input: {
        id,
        title,
      },
    },
  })
}
const Editoria = ({
  addCustomTags,
  nextBookComponent,
  title,
  bookTitle,
  bookId,
  prevBookComponent,
  bookComponentId,
  content,
  trackChangesEnabled,
  unlockBookComponent,
  renameBookComponent,
  lock: bookComponentLock,
  lockBookComponent,
  lockTrigger,
  workflowTrigger,
  editing,
  workflowStages,
  history,
  rules,
  onUnlocked,
  onWarning,
  onAssetManager,
  updateBookComponentContent,
  updateBookComponentTrackChanges,
  uploading,
  user,
  tags,
}) => {
  const handleAssetManager = () => onAssetManager(bookId)

  let translatedEditing
  switch (editing) {
    case 'selection':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService.own.accept = false
      configWax.AcceptTrackChangeService.others.accept = false
      configWax.RejectTrackChangeService.own.reject = false
      configWax.RejectTrackChangeService.others.reject = false
      translatedEditing = 'selection'
      break
    case 'preview':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService.own.accept = false
      configWax.AcceptTrackChangeService.others.accept = false
      configWax.RejectTrackChangeService.own.reject = false
      configWax.RejectTrackChangeService.others.reject = false
      translatedEditing = 'disabled'
      break
    case 'selection_without_tc':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService.own.accept = false
      configWax.AcceptTrackChangeService.others.accept = false
      configWax.RejectTrackChangeService.own.reject = false
      configWax.RejectTrackChangeService.others.reject = false
      translatedEditing = 'selection'
      break
    case 'review':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = trackChangesEnabled
      configWax.AcceptTrackChangeService.own.accept = false
      configWax.AcceptTrackChangeService.others.accept = true
      configWax.RejectTrackChangeService.own.reject = false
      configWax.RejectTrackChangeService.others.reject = false
      translatedEditing = 'full'
      break
    case 'full_without_tc':
      configWax.EnableTrackChangeService.toggle = false
      configWax.EnableTrackChangeService.enabled = false
      configWax.AcceptTrackChangeService.own.accept = false
      configWax.AcceptTrackChangeService.others.accept = true
      configWax.RejectTrackChangeService.own.reject = false
      configWax.RejectTrackChangeService.others.reject = false
      translatedEditing = 'full'
      break
    default:
      configWax.EnableTrackChangeService.toggle = true
      configWax.EnableTrackChangeService.enabled = trackChangesEnabled
      configWax.AcceptTrackChangeService.own.accept = true
      configWax.AcceptTrackChangeService.others.accept = true
      configWax.RejectTrackChangeService.own.reject = true
      configWax.RejectTrackChangeService.others.reject = true
      translatedEditing = 'full'
      break
  }
  const handleCustomTags = customTag => {
    addCustomTags({
      variables: {
        input: customTag,
      },
    })
  }

  const updateTitle = debounce(title => {
    if (translatedEditing === 'full') {
      handleTitleUpdate(title, bookComponentId, renameBookComponent)
    }
  }, 2000)

  const onChangeHandler = debounce(source => {
    if (translatedEditing === 'full') {
      handleSave(source, bookComponentId, updateBookComponentContent)
    }
  }, 2000)

  configWax.EnableTrackChangeService.updateTrackStatus = status => {
    updateBookComponentTrackChanges({
      variables: {
        input: {
          id: bookComponentId,
          trackChangesEnabled: status,
        },
      },
    })
  }
  configWax.TitleService = { updateTitle }
  configWax.ImageService = { handleAssetManager }
  configWax.CustomTagService.tags = tags
  configWax.CustomTagService.updateTags = handleCustomTags
  const isReadOnly =
    translatedEditing === 'selection' || translatedEditing === 'disabled'
  const [workChanged, setWorkChanged] = useState(false)

  const previousWorkflow = usePrevious(workflowStages) // reference for checking if the workflowStages actually change

  const { canAccessBook } = rules

  const onUnload = () => {
    if (!isReadOnly) {
      const blob = new Blob(
        [JSON.stringify({ uid: user.id, bbid: bookComponentId })],
        { type: 'text/plain; charset=UTF-8' },
      )
      // const serverProtocol = process.env.SERVER_PROTOCOL
      // const serverHost = process.env.SERVER_HOST
      // const serverPort = process.env.SERVER_PORT
      // const serverServeClient = process.env.SERVER_SERVE_CLIENT

      // let serverUrl, serverUrlWithProtocol

      // // can't build a valid url without these two
      // if (serverProtocol && serverHost) {
      //   serverUrl = `${serverHost}${serverPort ? `:${serverPort}` : ''}`
      //   serverUrlWithProtocol = `${serverProtocol}://${serverUrl}`
      // }

      // if (!serverUrl || serverServeClient) {
      //   serverUrl = window.location.host
      //   serverUrlWithProtocol = `${window.location.protocol}//${serverUrl}`
      // }

      navigator.sendBeacon('/api/unlockBeacon', blob)
      handleUnlock(bookComponentId, unlockBookComponent)
    }
  }
  useEffect(() => {
    if (uploading) {
      const onConfirm = () => {
        history.push(`/books/${bookId}/book-builder`)
      }
      return onWarning(
        'Uploading in progress, you will be redirected back to Book Builder',
        onConfirm,
      )
    }
    window.addEventListener('beforeunload', onUnload)
    if (!isReadOnly) {
      handleLock(bookComponentId, lockBookComponent)
    }

    return () => {
      window.removeEventListener('beforeunload', onUnload)
      updateTitle.cancel()
      onChangeHandler.cancel()
      onUnload()
    }
  }, [])

  // SECTION FOR USER HAS NO PERMISSIONS FOR THIS BOOK
  useEffect(() => {
    if (!canAccessBook) {
      const onConfirm = () => {
        history.push(`/books`)
      }
      onUnlocked(
        ' You have no permissions to access this book component. You will be redirected back to the dashboard',
        onConfirm,
      )
    }
  }, [canAccessBook])
  // END OF SECTION

  // SECTION FOR UNLOCKED BY ADMIN
  useEffect(() => {
    if (
      !isReadOnly &&
      lockTrigger &&
      lockTrigger.bookComponentId === bookComponentId
    ) {
      // Had the lock and lost it. The isReadOnly is used for the case of navigating between chapters with different permissions
      const onConfirm = () => {
        history.push(`/books/${bookId}/book-builder`)
      }
      onUnlocked(
        'The admin just unlocked this book component!! You will be redirected back to the Book Builder.',
        onConfirm,
      )
    }
  }, [lockTrigger])
  // END OF SECTION

  // SECTION FOR CHANGES IN THE WORKFLOW
  useEffect(() => {
    // this effect sets precedent which is used when the isReadOnly is calculated
    if (workflowTrigger && workflowTrigger.id === bookComponentId) {
      const { workflowStages: workflowNow } = workflowTrigger
      if (!isEqual(previousWorkflow, workflowNow)) {
        const initialChangeFromNoContentToContent =
          previousWorkflow[0].value === -1 && workflowNow[0].value === 0

        if (!initialChangeFromNoContentToContent) {
          // this is needed to distinguish this case from the case of removing a team member from a book
          setWorkChanged(true)
        }
      }
    }
  }, [workflowTrigger])

  useEffect(() => {
    if (workChanged && !isReadOnly) {
      const onConfirm = () => {
        handleLock(bookComponentId, lockBookComponent)
      }
      onWarning(
        'You have been granted edit access to this book component',
        onConfirm,
      )
      setWorkChanged(false)
    }
    if (workChanged && isReadOnly) {
      const onConfirm = () => {
        handleUnlock(bookComponentId, unlockBookComponent)
      }
      onWarning(
        'You no longer have edit access for this book component',
        onConfirm,
      )
      setWorkChanged(false)
    }
  }, [isReadOnly])
  // END OF SECTION

  return (
    <>
      <WaxHeader
        bookId={bookId}
        bookTitle={bookTitle}
        id={bookComponentId}
        nextBookComponent={nextBookComponent}
        prevBookComponent={prevBookComponent}
        title={title}
      />
      <WaxContainer>
        <Wax
          autoFocus
          config={configWax}
          fileUpload={() => true}
          key={bookComponentId}
          layout={EditoriaLayout}
          onChange={onChangeHandler}
          placeholder="Type Something..."
          readonly={isReadOnly}
          user={user}
          value={content}
        />
      </WaxContainer>
    </>
  )
}

export default Editoria
