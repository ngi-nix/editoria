/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { AssetManager } from './ui'
import {
  getFilesQuery,
  // uploadFilesMutation,
  // deleteFilesMutation,
  // updateFileMutation,
} from '../src/queries'

const mapper = {
  getFilesQuery,
  // uploadFilesMutation,
  // deleteFilesMutation,
  // updateFileMutation,
}

const mapProps = args => ({
  files: get(args.getFilesQuery, 'data.getFiles'),
  // uploadFiles: args.uploadFilesMutation.uploadFiles,
  // updateFile: args.updateFileMutation.updateBookFile,
  // deleteFiles: args.deleteFilesMutation.deleteFiles,
  refetching:
    args.getFilesQuery.networkStatus === 4 ||
    args.getFilesQuery.networkStatus === 2, // possible apollo bug
  loading: args.getFilesQuery.networkStatus === 1,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { data, isOpen, hideModal } = props
  const { bookId } = data
  console.log('sdafasdf', props)

  return (
    <Composed bookId={bookId}>
      {({ files, loading, refetching }) => (
        <AssetManager
          hideModal={hideModal}
          isOpen={isOpen}
          loading={loading}
          refetching={refetching}
          files={files}
        />
      )}
    </Composed>
  )
}

export default Connected
