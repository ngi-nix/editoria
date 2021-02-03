import React from 'react'
import { sortBy, forEach } from 'lodash'
import UploadButton from './UploadButton'

class UploadFilesButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      counter: 0,
      uploading: false,
    }
  }

  onChange = event => {
    event.preventDefault()

    const { book, onWarning, uploadBookComponent } = this.props
    const originalFiles = event.target.files

    forEach(originalFiles, element => {
      const extension = element.name.split('.')[1]

      if (extension !== 'docx') {
        return onWarning(
          'One or more of the selected files have unsupported extensions. Try to use only files with extension .docx',
        )
      }

      return true
    })

    const files = sortBy(originalFiles, 'name') // ensure order
    this.setState({ uploading: true, counter: files.length })

    const bookComponentFiles = files.map(file => ({
      file,
      bookId: book.id,
    }))

    uploadBookComponent({
      variables: {
        bookComponentFiles,
      },
    })
      .then(() => {
        this.setState({
          counter: 0,
          uploading: false,
        })
      })
      .catch(res => {
        this.setState({
          counter: 0,
          uploading: false,
        })
        return onWarning(
          'One or more of the selected files faced issues in conversion',
        )
      })

    return true
  }

  render() {
    const { uploading, counter } = this.state

    let labelText = 'Upload word files'

    if (counter > 1) {
      labelText = `Converting ${counter} files`
    } else if (counter === 1) {
      labelText = `Converting ${counter} file`
    }

    return (
      <UploadButton
        accept=".docx"
        disabled={uploading}
        id="generic"
        label={labelText}
        multiple
        onChange={this.onChange}
      />
    )
  }
}

export default UploadFilesButton
