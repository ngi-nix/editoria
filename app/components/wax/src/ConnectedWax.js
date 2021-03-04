/* eslint-disable no-console */

import React from 'react'
import { get, sortBy, isEmpty } from 'lodash'
import { adopt } from 'react-adopt'
import config from 'config'
import { withRouter } from 'react-router-dom'
import withModal from '../../common/src/withModal'
import { Loading } from '../../../ui'

import WaxPubsweet from './WaxPubsweet'
import {
  getBookComponentQuery,
  getCustomTagsQuery,
  getWaxRulesQuery,
  getUserTeamsQuery,
  getSpecificFilesQuery,
  spellCheckerQuery,
  updateCustomTagMutation,
  addCustomTagMutation,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  renameBookComponentMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  trackChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
  customTagsSubscription,
  workflowChangeSubscription,
} from './queries'

const mapper = {
  getBookComponentQuery,
  getCustomTagsQuery,
  getWaxRulesQuery,
  getUserTeamsQuery,
  getSpecificFilesQuery,
  spellCheckerQuery,
  trackChangeSubscription,
  lockChangeSubscription,
  orderChangeSubscription,
  customTagsSubscription,
  workflowChangeSubscription,
  updateCustomTagMutation,
  addCustomTagMutation,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  renameBookComponentMutation,
  withModal,
}
// bug
const getUserWithColor = (teams = []) => {
  const team =
    sortBy(config.authsome.teams, ['weight']).find(teamConfig =>
      teams.some(team => team.role === teamConfig.role),
    ) || {}
  if (!isEmpty(team)) {
    return team.color
  }

  return {
    addition: 'royalblue',
    deletion: 'indianred',
  }
}

const mapProps = args => ({
  rules: get(args.getWaxRulesQuery, 'data.getWaxRules'),
  tags: get(args.getCustomTagsQuery, 'data.getCustomTags'),
  bookComponent: get(args.getBookComponentQuery, 'data.getBookComponent'),
  teams: get(args.getUserTeamsQuery, 'data.teams'),
  updateTags: args.updateCustomTagMutation.updateCustomTag,
  addCustomTags: args.addCustomTagMutation.addCustomTag,
  updateBookComponentContent:
    args.updateBookComponentContentMutation.updateContent,
  updateBookComponentTrackChanges:
    args.updateBookComponentTrackChangesMutation.updateTrackChanges,
  uploadFile: args.uploadFileMutation.uploadFile,
  renameBookComponent: args.renameBookComponentMutation.renameBookComponent,
  lockBookComponent: args.lockBookComponentMutation.lockBookComponent,
  unlockBookComponent: args.unlockBookComponentMutation.unlockBookComponent,
  lockTrigger: get(
    args.lockChangeSubscription.lockUpdated,
    'data.bookComponentLockUpdated',
  ),
  workflowTrigger: get(
    args.workflowChangeSubscription.workflowUpdated,
    'data.bookComponentWorkflowUpdated',
  ),
  onAssetManager: bookId =>
    new Promise((resolve, reject) => {
      const { withModal } = args

      const { showModal, hideModal } = withModal

      const handleImport = async selectedFileIds => {
        const {
          getSpecificFilesQuery: { client, query },
        } = args
        const { data } = await client.query({
          query,
          variables: { ids: selectedFileIds },
        })
        const { getSpecificFiles } = data

        hideModal()
        resolve(getSpecificFiles)
      }

      showModal('assetManagerEditor', {
        bookId,
        withImport: true,
        handleImport,
      })
    }),
  checkSpell: (language, text) => {
    const {
      spellCheckerQuery: { client, query },
    } = args

    return client.query({ query, variables: { language, text } })
  },
  onUnlocked: (warning, handler) => {
    const { withModal } = args
    const { showModal, hideModal } = withModal
    const onClick = () => {
      handler()
      hideModal()
    }
    showModal('unlockedModal', {
      onConfirm: onClick,
      warning,
    })
  },
  onWarning: (warning, handler) => {
    const { withModal } = args
    const { showModal, hideModal } = withModal
    const onClick = () => {
      handler()
      hideModal()
    }
    showModal('unlockedModal', {
      onConfirm: onClick,
      warning,
    })
  },
  loading: args.getBookComponentQuery.networkStatus === 1,
  waxLoading: args.getWaxRulesQuery.networkStatus === 1,
  teamsLoading: args.getUserTeamsQuery.networkStatus === 1,
  tagsLoading: args.getCustomTagsQuery.networkStatus === 1,
  refetching:
    args.getBookComponentQuery.networkStatus === 4 ||
    args.getBookComponentQuery.networkStatus === 2, // possible apollo bug
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history, currentUser } = props
  const { bookId, bookComponentId } = match.params

  return (
    <Composed
      bookComponentId={bookComponentId}
      bookId={bookId}
      currentUser={currentUser}
    >
      {({
        bookComponent,
        checkSpell,
        tags,
        onAssetManager,
        onUnlocked,
        onWarning,
        rules,
        teams,
        updateTags,
        addCustomTags,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        unlockBookComponent,
        lockBookComponent,
        renameBookComponent,
        loading,
        waxLoading,
        teamsLoading,
        tagsLoading,
        refetching,
        lockTrigger,
        workflowTrigger,
      }) => {
        const user = Object.assign({}, currentUser, {
          userColor: getUserWithColor(teams),
          userId: currentUser.id,
        })

        if (
          loading ||
          waxLoading ||
          teamsLoading ||
          tagsLoading ||
          !bookComponent
        )
          return <Loading />

        let editing
        const {
          componentType,
          divisionType,
          id,
          content,
          trackChangesEnabled,
          componentTypeOrder,
          nextBookComponent,
          prevBookComponent,
          bookTitle,
          title,
          lock,
          workflowStages,
        } = bookComponent
        if (lock && lock.userId !== user.id) {
          editing = 'preview'
        } else if (rules.canEditPreview) {
          editing = 'preview'
        } else if (rules.canEditFull) {
          editing = 'full'
        } else if (rules.canEditSelection) {
          editing = 'selection'
        } else if (rules.canEditReview) {
          editing = 'review'
        }

        return (
          <WaxPubsweet
            addCustomTags={addCustomTags}
            bookComponentId={id}
            bookId={bookId}
            bookTitle={bookTitle}
            checkSpell={checkSpell}
            componentType={componentType}
            componentTypeOrder={componentTypeOrder}
            content={content}
            divisionType={divisionType}
            editing={editing}
            history={history}
            key={id}
            loading={loading}
            lock={lock}
            lockBookComponent={lockBookComponent}
            lockTrigger={lockTrigger}
            nextBookComponent={nextBookComponent}
            onAssetManager={onAssetManager}
            onUnlocked={onUnlocked}
            onWarning={onWarning}
            prevBookComponent={prevBookComponent}
            renameBookComponent={renameBookComponent}
            rules={rules}
            tags={tags}
            teamsLoading={teamsLoading}
            title={title}
            trackChangesEnabled={trackChangesEnabled}
            unlockBookComponent={unlockBookComponent}
            updateBookComponentContent={updateBookComponentContent}
            updateBookComponentTrackChanges={updateBookComponentTrackChanges}
            updateCustomTags={updateTags}
            user={user}
            waxLoading={waxLoading}
            workflowStages={workflowStages}
            workflowTrigger={workflowTrigger}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
