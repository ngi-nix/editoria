import React, { useMemo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Wax } from 'wax-prosemirror-core'
import { EditoriaLayout } from '../layout'
import { configWax } from '../config'
import WaxHeader from './WaxHeader'

const WaxContainer = styled.div`
  height: calc(100% - 72px);
  width: 100%;
`
const handleUnlock = (id, unlockBookComponent) => {
  unlockBookComponent({
    variables: {
      input: {
        id,
      },
    },
  })
}

const handleLock = (id, lockBookComponent) =>
  lockBookComponent({
    variables: {
      input: {
        id,
      },
    },
  })

const handleSave = (content, id, updateBookComponentContent) =>
  updateBookComponentContent({
    variables: {
      input: {
        id,
        content,
      },
    },
  })

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
  divisionType,
  componentType,
  nextBookComponent,
  title,
  bookTitle,
  bookId,
  prevBookComponent,
  bookComponentId,
  content,
  lock: bookComponentLock,
  componentTypeOrder,
  trackChangesEnabled,
  unlockBookComponent,
  renameBookComponent,
  lockBookComponent,
  editing,
  checkSpell,
  history,
  onUnlocked,
  onAssetManager,
  updateBookComponentContent,
  user,
  tags,
}) => {
  const [hasLock, setHasLock] = useState(null)

  const onUnload = () => {
    handleUnlock(bookComponentId, unlockBookComponent)
    window.removeEventListener('beforeunload', onUnload)
  }

  const updateTitle = title => {
    handleTitleUpdate(title, bookComponentId, renameBookComponent)
  }

  const handleAssetManager = () => onAssetManager(bookId)
  // console.log('user', user)
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
  // console.log('tags', tags)
  configWax.TitleService = { updateTitle }
  configWax.ImageService = { handleAssetManager }
  configWax.CustomTagService.tags = tags
  configWax.CustomTagService.updateTags = handleCustomTags

  const isReadOnly =
    bookComponentLock ||
    translatedEditing === 'selection' ||
    translatedEditing === 'disabled'

  useEffect(() => {
    if (!isReadOnly) {
      window.addEventListener('beforeunload', onUnload)
      handleLock(bookComponentId, lockBookComponent).then(({ data }) => {
        const { lockBookComponent } = data
        const { id } = lockBookComponent
        if (id) {
          setHasLock(true)
        }
      })
    }

    return () => {
      if (!isReadOnly) {
        onUnload()
      }
    }
  }, [])

  useEffect(() => {
    if (!bookComponentLock && hasLock) {
      const onConfirm = () => {
        history.push(`/books/${bookId}/book-builder`)
      }
      onUnlocked(
        'The admin just unlocked this book component!! You will be redirected back to the Book Builder.',
        onConfirm,
      )
    }
  }, [bookComponentLock])

  const EditoriaComponent = useMemo(
    () => (
      <WaxContainer>
        <Wax
          autoFocus
          config={configWax}
          fileUpload={() => true}
          key={bookComponentId}
          layout={EditoriaLayout}
          onChange={source =>
            handleSave(source, bookComponentId, updateBookComponentContent)
          }
          placeholder="Type Something..."
          readonly={isReadOnly}
          user={user}
          value={content || ''}
        />
      </WaxContainer>
    ),
    [],
  )
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
      {EditoriaComponent}
    </>
  )
}

export default Editoria
