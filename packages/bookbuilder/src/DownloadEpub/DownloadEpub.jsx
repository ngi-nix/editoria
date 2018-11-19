import React from 'react'
import config from 'config'
import axios from 'axios'
import classes from './DownloadEpub.local.scss'
import ErrorModal from './ErrorModal'

const DownloadEpub = ({ book, showModal, showModalToggle, outerContainer }) => {
  let modal
  let converter
  if (config['pubsweet-client'] && config['pubsweet-client'].converter) {
    converter = config['pubsweet-client'].converter
  }

  const handleDownload = () => {
    axios
      .get(
        `/api/collections/${book.id}/epub?destination=attachment&converter=${
          !converter ? 'default' : converter
        }&style=epub.css`,
      )
      .then(res => {
        window.location.replace(res.request.responseURL)
      })
      .catch(error => {
        showModalToggle()
        console.error(error)
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
