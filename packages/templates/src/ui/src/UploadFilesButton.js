import React from 'react'
import { forEach, sortBy, map, find, filter } from 'lodash'
import UploadButton from './UploadButton'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

class UploadFilesButton extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      counter: 0,
      uploading: false,
    }
  }

  onChange(event) {
    event.preventDefault()

    const { createTemplate } = this.props
    const originalFiles = event.target.files

    const files = sortBy(originalFiles, 'name')
    createTemplate({
      variables: {
        input: {
          files,
          templateName: 'Test temp',
          author: 'Alex G',
          target: 'epub',
        },
      },
    })
  }

  render() {
    const { uploading, counter } = this.state
    let labelText = 'upload word files'

    if (counter > 1) {
      labelText = `converting ${counter} files`
    } else if (counter === 1) {
      labelText = `converting ${counter} file`
    }

    return (
      <UploadButton
        accept=".css, .otf, .woff, .woff2"
        id="generic"
        disabled={uploading}
        label={labelText}
        multiple
        onChange={this.onChange}
      />
    )
  }
}

export default UploadFilesButton
