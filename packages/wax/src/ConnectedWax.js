/* eslint-disable no-console */

import React from 'react'
import { get, sortBy, map } from 'lodash'
import { adopt } from 'react-adopt'
import config from 'config'
import { withRouter } from 'react-router-dom'
import withModal from 'editoria-common/src/withModal'

import WaxPubsweet from './WaxPubsweet'
import statefull from './Statefull'
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
} from './queries'

const mapper = {
  statefull,
  withModal,
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
  updateCustomTagMutation,
  addCustomTagMutation,
  updateBookComponentContentMutation,
  updateBookComponentTrackChangesMutation,
  lockBookComponentMutation,
  unlockBookComponentMutation,
  uploadFileMutation,
  renameBookComponentMutation,
}

const getUserWithColor = (teams = []) => {
  const team =
    sortBy(config.authsome.teams, ['weight']).find(teamConfig =>
      teams.some(team => team.role === teamConfig.role),
    ) || {}
  return team.color
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
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
  const { match, history, config, currentUser } = props
  const { bookId, bookComponentId } = match.params

  return (
    <Composed
      bookComponentId={bookComponentId}
      bookId={bookId}
      currentUser={currentUser}
      key={bookComponentId}
    >
      {({
        bookComponent,
        checkSpell,
        tags,
        setState,
        onAssetManager,
        onUnlocked,
        rules,
        teams,
        updateTags,
        addCustomTags,
        updateBookComponentContent,
        updateBookComponentTrackChanges,
        uploadFile,
        lockBookComponent,
        unlockBookComponent,
        renameBookComponent,
        loading,
        waxLoading,
        teamsLoading,
        tagsLoading,
      }) => {
        const user = Object.assign({}, currentUser, {
          color: getUserWithColor(teams),
        })
        if (loading || waxLoading || teamsLoading || tagsLoading) return null

        let editing
        const lock = get(bookComponent, 'lock')
        if (lock && lock.userId !== currentUser.id) {
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
            bookComponent={bookComponent}
            bookComponentId={bookComponentId}
            bookId={bookId}
            checkSpell={checkSpell}
            config={config}
            editing={editing}
            history={history}
            key={bookComponent.id}
            loading={loading}
            lockBookComponent={lockBookComponent}
            onAssetManager={onAssetManager}
            onUnlocked={onUnlocked}
            renameBookComponent={renameBookComponent}
            rules={rules}
            setState={setState}
            tags={tags}
            teamsLoading={teamsLoading}
            unlockBookComponent={unlockBookComponent}
            updateBookComponentContent={updateBookComponentContent}
            updateBookComponentTrackChanges={updateBookComponentTrackChanges}
            updateCustomTags={updateTags}
            uploadFile={uploadFile}
            user={user}
            waxLoading={waxLoading}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
