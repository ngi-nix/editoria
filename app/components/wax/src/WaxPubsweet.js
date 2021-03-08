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
  onUnlocked,
  onWarning,
  onAssetManager,
  updateBookComponentContent,
  updateBookComponentTrackChanges,
  user,
  tags,
}) => {
  const updateTitle = debounce(title => {
    handleTitleUpdate(title, bookComponentId, renameBookComponent)
  }, 1000)

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
  const handleCustomTags = customTags => {
    const addTags = customTags.filter(tag => !tag.id)
    if (addTags.length > 0) {
      addCustomTags({
        variables: {
          input: addTags,
        },
      })
    }
  }

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

  const onUnload = () => {
    if (!isReadOnly) {
      handleUnlock(bookComponentId, unlockBookComponent)
    }
  }
  useEffect(() => {
    window.addEventListener('beforeunload', onUnload)
    if (!isReadOnly) {
      handleLock(bookComponentId, lockBookComponent)
    }

    return () => {
      window.removeEventListener('beforeunload', onUnload)
      onUnload()
    }
  }, [])

  // SECTION FOR UNLOCKED BY ADMIN
  const lockChangeTrigger =
    lockTrigger &&
    lockTrigger.id === bookComponentId &&
    lockTrigger.lock &&
    lockTrigger.lock.id

  useEffect(() => {
    if (lockTrigger) {
      if (!lockTrigger.lock && bookComponentLock && !isReadOnly) {
        // Had the lock and lost it. The isReadOnly is used for the case of navigating between chapters with different permissions
        const onConfirm = () => {
          history.push(`/books/${bookId}/book-builder`)
        }
        onUnlocked(
          'The admin just unlocked this book component!! You will be redirected back to the Book Builder.',
          onConfirm,
        )
      }
    }
  }, [lockChangeTrigger])
  // END OF SECTION
  // console.log('what', locked)
  // SECTION FOR CHANGES IN THE WORKFLOW
  useEffect(() => {
    // this effect sets precedent which is used when the isReadOnly is calculated
    if (workflowTrigger && workflowTrigger.id === bookComponentId) {
      const { workflowStages: workflowNow } = workflowTrigger
      if (!isEqual(previousWorkflow, workflowNow)) {
        setWorkChanged(true)
      }
    }
  }, [workflowStages])

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
          onChange={source => {
            handleSave(source, bookComponentId, updateBookComponentContent)
          }}
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
