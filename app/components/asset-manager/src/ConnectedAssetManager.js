/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { AssetManager } from './ui'
import {
  getEntityFilesQuery,
  uploadFilesMutation,
  deleteBookFilesMutation,
  updateFileMutation,
  filesUploadedSubscription,
  filesDeletedSubscription,
  fileUpdatedSubscription,
} from '../src/queries'

const mapper = {
  getEntityFilesQuery,
  filesUploadedSubscription,
  filesDeletedSubscription,
  fileUpdatedSubscription,
  uploadFilesMutation,
  deleteBookFilesMutation,
  updateFileMutation,
}

const mapProps = args => ({
  files: get(args.getEntityFilesQuery, 'data.getEntityFiles'),
  uploadFiles: (bookId, files) => {
    const { uploadFilesMutation } = args
    const { uploadFiles } = uploadFilesMutation
    return uploadFiles({
      variables: {
        files,
        entityType: 'book',
        entityId: bookId,
      },
    })
  },
  deleteFiles: ids => {
    const { deleteBookFilesMutation } = args
    const { deleteFiles } = deleteBookFilesMutation
    return deleteFiles({
      variables: {
        ids,
      },
    })
  },
  refetch: (bookId, sortingParams) => {
    const { getEntityFilesQuery } = args
    const { refetch } = getEntityFilesQuery
    refetch({
      input: {
        entityId: bookId,
        entityType: 'book',
        sortingParams,
        includeInUse: true,
      },
    })
  },
  updateFile: (fileId, data) => {
    const { updateFileMutation } = args
    const { updateFile } = updateFileMutation
    return updateFile({
      variables: {
        input: {
          id: fileId,
          ...data,
        },
      },
    })
  },
  refetching:
    args.getEntityFilesQuery.networkStatus === 4 ||
    args.getEntityFilesQuery.networkStatus === 2, // possible apollo bug
  loading: args.getEntityFilesQuery.networkStatus === 1,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { data, isOpen, hideModal } = props
  const { bookId, withImport, handleImport } = data

  return (
    <Composed entityId={bookId}>
      {({
        deleteFiles,
        files,
        loading,
        uploadFiles,
        updateFile,
        refetching,
        refetch,
      }) => (
        <AssetManager
          bookId={bookId}
          deleteFiles={deleteFiles}
          files={files}
          handleImport={handleImport}
          hideModal={hideModal}
          isOpen={isOpen}
          loading={loading}
          refetch={refetch}
          refetching={refetching}
          updateFile={updateFile}
          uploadFiles={uploadFiles}
          withImport={withImport}
        />
      )}
    </Composed>
  )
}

export default Connected
