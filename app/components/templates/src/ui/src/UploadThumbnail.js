import React from 'react'
import styled from 'styled-components'
import { mimetypeHelpers } from '../../../../common'

import UploadButton from './UploadButton'

const StyledButton = styled(UploadButton)`
  border: 1px solid grey;
  height: 266px;
  width: 188px;
`

const { templateThumbnailExtensions } = mimetypeHelpers
class UploadThumbnail extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  onChange(event) {
    event.preventDefault()

    const { updateThumbnail, setFieldValue, setFieldTouched } = this.props
    const originalFiles = event.target.files
    updateThumbnail(originalFiles[0], setFieldValue, setFieldTouched)
  }

  renderButton() {
    const { withIcon } = this.props
    if (withIcon) {
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
        <StyledButton
          accept={templateThumbnailExtensions}
          icon={addIcon}
          id="thumbnail"
          onChange={this.onChange}
          title="Add Thumbnail"
        />
      )
    }
    return (
      <UploadButton
        accept={templateThumbnailExtensions}
        id="thumbnail"
        label="Change Thumbnail"
        onChange={this.onChange}
        title="Change Thumbnail"
      />
    )
  }

  render() {
    return this.renderButton()
  }
}

export default UploadThumbnail
