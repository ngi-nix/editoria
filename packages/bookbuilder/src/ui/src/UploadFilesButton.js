import React from 'react'
import { forEach, sortBy, map, find } from 'lodash'
import axios from 'axios'
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

  // Extracting Properties for fragment Based to Name
  // Preferably a Rule implementation should be created
  // moving this function to a better context a not to Uploading Component
  static extractFragmentProperties(fileName) {
    const nameSpecifier = fileName.slice(0, 1) // get division from name

    let division
    if (nameSpecifier === 'a') {
      division = 'Frontmatter'
    } else if (nameSpecifier === 'w') {
      division = 'Backmatter'
    } else {
      division = 'Body'
    }

    let componentType
    if (division !== 'Body') {
      componentType = 'component'
    } else if (fileName.includes('00')) {
      componentType = 'unnumbered'
    } else if (fileName.includes('pt0')) {
      componentType = 'part'
    } else {
      componentType = 'chapter'
    }

    return {
      division,
      componentType,
    }
  }

  makeBookComponents(fileList) {
    const { book, create, divisions } = this.props
    const bookComponents = map(fileList, file => {
      const name = file.name.replace(/\.[^/.]+$/, '')
      const {
        componentType,
        division,
      } = this.constructor.extractFragmentProperties(name)
      const divisionId = find(divisions, { label: division })
      return {
        title: name,
        bookId: book.id,
        uploading: true,
        componentType,
        divisionId: divisionId.id,
      }
    })
    return create({
      variables: {
        input: bookComponents,
      },
    })
  }

  onChange(event) {
    event.preventDefault()

    const { update } = this.props
    const { counter } = this.state
    const originalFiles = event.target.files

    const files = sortBy(originalFiles, 'name') // ensure order
    this.setState({ uploading: true, counter: files.length })
    this.makeBookComponents(files).then(res => {
      const { data } = res
      const { addBookComponents } = data
      forEach(files, file => {
        const bodyFormData = new FormData()
        bodyFormData.append('file', file)
        axios({
          method: 'post',
          url: 'http://localhost:3050/api/ink',
          data: bodyFormData,
          config: { headers: { 'Content-Type': 'multipart/form-data' } },
        })
          .then(response => {
            const name = file.name.replace(/\.[^/.]+$/, '')
            const correspondingBookComponent = find(addBookComponents, {
              title: name,
            })
            correspondingBookComponent.workflowStages[0].value = 1
            correspondingBookComponent.workflowStages[1].value = 0
            const workflowStages = map(
              correspondingBookComponent.workflowStages,
              item => ({
                label: item.label,
                type: item.type,
                value: item.value,
              }),
            )
            update({
              variables: {
                input: {
                  id: correspondingBookComponent.id,
                  content: response.data.converted,
                  uploading: false,
                  workflowStages,
                },
              },
            }).then(res => {
              this.setState({ counter: counter - 1 })
              if (counter === 0) {
                this.setState({ uploading: false })
              }
            })
          })
          .catch(error => {
            this.setState({ counter: 0, uploading: false })
            console.log('error', error)
          })
      })
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
        accept=".docx"
        disabled={uploading}
        label={labelText}
        multiple
        onChange={this.onChange}
      />
    )
  }
}

export default UploadFilesButton
