import React from 'react'
import PropTypes from 'prop-types'
import {
  forEach,
  groupBy,
  has,
  isEmpty,
  keys,
  pickBy,
  sortBy,
  map,
  find,
} from 'lodash'
import axios from 'axios'
import styles from '../styles/bookBuilder.local.scss'

class FileUploader extends React.Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      // counter: {
      //   back: this.props.backChapters.length,
      //   body: this.props.bodyChapters.length,
      //   front: this.props.frontChapters.length,
      // },
      uploading: {},
    }
  }

  handleUploadStatusChange(fragmentId, bool) {
    //
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

  // Get latest fragment rev for when ink is done
  // (and update runs with a potentially changed rev)
  // getFragmentRev(id, division) {
  //   const divisionFragments = this.getFragmentsForDivision(division)

  //   const fragment = divisionFragments.find(f => f.id === id)
  //   return fragment.rev
  // }

  getFragmentsForDivision(division) {
    // const mapper = {
    //   back: this.props.backChapters,
    //   body: this.props.bodyChapters,
    //   front: this.props.frontChapters,
    // }
    // return mapper[division]
  }

  onChange(event) {
    event.preventDefault()

    const { book, convert, update, updateUploadStatus } = this.props

    const originalFiles = event.target.files
    const files = sortBy(originalFiles, 'name') // ensure order
    const bodyFormData = new FormData()
    // const self = this
    this.makeBookComponents(files).then(res => {
      const { data } = res
      const { addBookComponents } = data
      console.log('resam', res)
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
            console.log('source', response)
            console.log('component', correspondingBookComponent)
            update({
              variables: {
                input: {
                  id: correspondingBookComponent.id,
                  content: response.data.converted,
                  uploading: false,
                  workflowStages,
                },
              },
            })
          })
          .catch(error => {
            console.log('error', error)
          })
      })
    })
    // const some = await this.makeBookComponents(files)
    // console.log('sdf', some)
    // each(this.makeBookComponents(files), p => {
    //   p.then(res => {
    //     console.log('resa', res)
    //   })
    // })
    //   .then(frags => {
    // each(files, (file, i) => {
    // axios({
    //   method: 'post',
    //   url: 'http://localhost:3050/api/ink',
    //   data: bodyFormData,
    //   config: { headers: { 'Content-Type': 'multipart/form-data' } },
    // })
    //   .then(function(response) {
    //     //handle success
    //     console.log(response)
    //   })
    //   .catch(function(response) {
    //     //handle error
    //     console.log(response)
    //   })
    // const fragment = frags[i]

    // this.handleUploadStatusChange(fragment.id, true)
    // updateUploadStatus(this.state.uploading)

    // convert({ variables: { files } }).then(response => {
    // console.log(response)
    // const patch = {
    //   id: fragment.id,
    //   source: response.converted,
    //   progress: {
    //     upload: 1,
    //     file_prep: 0,
    //     edit: -1,
    //     review: -1,
    //     clean_up: -1,
    //     page_check: -1,
    //     final: -1,
    //   },
    // }

    // update(book, patch)

    // self.handleUploadStatusChange(fragment.id, false)
    // updateUploadStatus(self.state.uploading)
    // })
    // .catch(error => {
    //   console.error(error)
    //   const patch = {
    //     id: fragment.id,
    //     progress: {
    //       upload: -1,
    //       file_prep: -1,
    //       edit: -1,
    //       review: -1,
    //       clean_up: -1,
    //       page_check: -1,
    //       final: -1,
    //     },
    //   }

    //   update(book, patch)
    //   self.handleUploadStatusChange(fragment.id, false)
    //   updateUploadStatus(self.state.uploading)
    // })
    // })
    // })
    // .catch(error => {
    // console.error(error)
    // })
  }

  render() {
    const { uploading } = this.state
    console.log(this.props)
    // const uploadingOnly = pickBy(uploading, (value, key) => value === true)
    // const currentlyUploading = keys(uploadingOnly).length

    let labelText
    // if (currentlyUploading > 0) {
    // labelText = `converting ${currentlyUploading} files`
    // } else {
    labelText = 'upload word files'
    // }

    return (
      <div className={`${styles.multipleUploadContainer}`}>
        <i className={styles.uploadIcon} htmlFor="file-uploader" />

        <label className={styles.uploadMultipleText} htmlFor="file-uploader">
          {labelText}
        </label>

        <input
          accept=".docx"
          id="file-uploader"
          multiple
          name="file-uploader"
          onChange={this.onChange}
          ref={c => {
            this.input = c
          }}
          type="file"
        />
      </div>
    )
  }
}

FileUploader.propTypes = {
  backChapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  bodyChapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  convert: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  frontChapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.string,
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  update: PropTypes.func.isRequired,
  updateUploadStatus: PropTypes.func.isRequired,
}

export default FileUploader
