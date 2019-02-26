import React from 'react'
import config from 'config'
import ErrorModal from './ErrorModal'
import { ButtonWithIcon } from './Button'

const DownloadEpub = ({
  book,
  htmlToEpub,
  showModal,
  showModalToggle,
  outerContainer,
}) => {
  let modal
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
        showModalToggle()
      })
  }

  const toggleModal = () => {
    showModalToggle()
  }
  const icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
  if (showModal) {
    modal = (
      <ErrorModal
        container={outerContainer}
        show={showModal}
        toggle={toggleModal}
      />
    )
  }

  return (
    <React.Fragment>
      <ButtonWithIcon
        icon={icon}
        label="Download Epub"
        onClick={handleDownload}
      />
      {modal}
    </React.Fragment>
  )
}

export default DownloadEpub
