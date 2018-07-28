import React from 'react'
import config from 'config'
import axios from 'axios'
import classes from './DownloadEpub.local.scss'
import ErrorModal from './ErrorModal'

const DownloadEpub = ({ book, showModal, showModalToggle, outerContainer }) => {
  let modal
  const handleDownload = () => {
    axios
      .get(
        `${config['pubsweet-server'].baseUrl}/api/collections/${
          book.id
        }/epub?destination=attachment&converter=wax&style=epub.css`,
      )
      .then(res => {
        window.location.replace(res.request.responseURL)
      })
      .catch(error => showModalToggle())
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
      <span>
        <label className={classes.exportToBookIcon} />
        <span className={classes.donwloadEpubText}>Download Epub</span>
      </span>
      {modal}
    </div>
  )
}

export default DownloadEpub
