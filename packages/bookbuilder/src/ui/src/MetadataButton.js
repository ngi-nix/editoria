import React from 'react'
import config from 'config'
import { ButtonWithIcon } from './Button'

const MetadataButton = ({ book, onMetadataAdd, onError }) => {
  let converter
  if (config['pubsweet-client'] && config['pubsweet-client'].converter) {
    converter = config['pubsweet-client'].converter
  }

  const handleDownload = () => {
    htmlToEpub({
      variables: {
        bookId: book.id,
        destination: 'attachment',
        converter: !converter ? 'default' : `${converter}`,
        style: 'epub.css',
      },
    })
      .then(res => {
        const { data } = res
        const { exportBook } = data
        window.location.replace(exportBook)
      })
      .catch(error => {
        console.error('er', error)
        onError(error)
      })
  }

  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  )

  return (
    <React.Fragment>
      <ButtonWithIcon icon={icon} label="Metadata" onClick={onMetadataAdd} />
    </React.Fragment>
  )
}

export default MetadataButton
