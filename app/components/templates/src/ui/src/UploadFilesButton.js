import React from 'react'
import { mimetypeHelpers } from '../../../../common'
import UploadButton from './UploadButton'

const { templateFileExtensions } = mimetypeHelpers
class UploadFilesButton extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    event.preventDefault()

    const { updateFilesList, setFieldValue, setFieldTouched } = this.props
    const originalFiles = event.target.files
    updateFilesList(originalFiles, setFieldValue, setFieldTouched)
  }

  render() {
    const addIcon = (
      <svg
        fill="black"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    )

    return (
      <UploadButton
        accept={templateFileExtensions}
        icon={addIcon}
        id="files"
        label="Add files"
        multiple
        onChange={this.onChange}
        title="Add files"
      />
    )
  }
}

export default UploadFilesButton
