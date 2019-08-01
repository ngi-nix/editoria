import React from 'react'
import { forEach, sortBy, map, find, filter } from 'lodash'
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

    const { update, onWarning } = this.props
    const originalFiles = event.target.files
    const self = this
    for (let i = 0; i < originalFiles.length; i++) {
      const extension = originalFiles[i].name.split('.')[1]
      
      if (extension !== 'docx') {
        return onWarning(
          'One or more of the selected files have unsupported extensions. Try to use only files with extension .docx',
        )
      }
    }

    const files = sortBy(originalFiles, 'name') // ensure order
    this.setState({ uploading: true, counter: files.length })
    this.makeBookComponents(files).then(res => {
      const { data } = res
      const { addBookComponents } = data
      
      Promise.all(
        map(files, async file => {
          const bodyFormData = new FormData()
          bodyFormData.append('file', file)
          return axios({
            method: 'post',
            url: '/api/ink',
            data: bodyFormData,
            config: { headers: { 'Content-Type': 'multipart/form-data' } },
          })
            .then(async response => {
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
              await update({
                variables: {
                  input: {
                    id: correspondingBookComponent.id,
                    content: response.data.converted,
                    uploading: false,
                    workflowStages,
                  },
                },
              }).then(res => {
                self.setState({ counter: self.state.counter - 1 })
              })
            })
            .catch(error => {
              console.log('error', error)
              const stuckedBookComponents = filter(addBookComponents, {
                uploading: true,
              })
              console.log('str', stuckedBookComponents)
              Promise.all(
                map(stuckedBookComponents, async bookComponent => {
                  update({
                    variables: {
                      input: {
                        id: bookComponent.id,
                        uploading: false,
                      },
                    },
                  })
                }),
              )
              self.setState({ counter: self.state.counter - 1 })
            })
        }),
      )
        .then(() => {
          self.setState({ uploading: false })
        })
        .catch(async error => {
          self.setState({ counter: 0, uploading: false })
          console.log('error', error)
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