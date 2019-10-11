import React from 'react'
import { forEach, sortBy, map, find, filter } from 'lodash'
import UploadButton from './UploadButton'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

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
    const icon = (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.79999 7.2H10.4C10.84 7.2 11.2 7.56 11.2 8C11.2 8.44 10.84 8.8 10.4 8.8H8.79999V10.4C8.79999 10.84 8.43999 11.2 7.99999 11.2C7.55999 11.2 7.19999 10.84 7.19999 10.4V8.8H5.59999C5.15999 8.8 4.79999 8.44 4.79999 8C4.79999 7.56 5.15999 7.2 5.59999 7.2H7.19999V5.6C7.19999 5.16 7.55999 4.8 7.99999 4.8C8.43999 4.8 8.79999 5.16 8.79999 5.6V7.2Z"
          fill="#828282"
          id="circle"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          id="cross"
          d="M8 0C3.5888 0 0 3.5888 0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0ZM8 14.4C4.4712 14.4 1.6 11.5288 1.6 8C1.6 4.4712 4.4712 1.6 8 1.6C11.5288 1.6 14.4 4.4712 14.4 8C14.4 11.5288 11.5288 14.4 8 14.4Z"
          fill="#828282"
        />
      </svg>
    )

    return (
      <UploadButton
        accept=".css, .otf, .woff, .woff2"
        icon={icon}
        id="files"
        label="add files"
        multiple
        onChange={this.onChange}
      />
    )
  }
}

export default UploadFilesButton
