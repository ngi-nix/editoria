import React from 'react'
import config from 'config'
import axios from 'axios'
import classes from './DownloadEpub.local.scss'
import ErrorModal from './ErrorModal'

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
        console.log('res', res)
        const { data } = res
        const { exportBook } = data
        console.log('e', exportBook)
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
    <div className={`${classes.exportBookContainer}`} onClick={handleDownload}>
      <i className={classes.exportToBookIcon} />
      <label className={classes.downloadEpubText}>Download Epub</label>
      {modal}
    </div>
  )
}

export default DownloadEpub
