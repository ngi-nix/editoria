import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import { filter, findIndex, find, cloneDeep, uniqueId, isEmpty } from 'lodash'
import { Formik } from 'formik'
import Select from 'react-select'
import FormModal from '../../../../../common/src/FormModal'
import { UploadFilesButton, UploadThumbnail } from '../..'

import { Button, Icons } from '../../../../../../ui'

const { deleteIcon } = Icons

const selectOptions = [
  { label: 'EPUB', value: 'epub' },
  { label: 'PagedJS', value: 'pagedjs' },
  { label: 'VivlioStyle', value: 'vivliostyle' },
]

const noteSelectOptions = [
  { label: 'Footnotes', value: 'footnotes' },
  { label: 'Endnotes', value: 'endnotes' },
  { label: 'Chapter end notes', value: 'chapterEnd' },
]

const StyledFormik = styled(Formik)`
  width: 100%;
`
const Body = styled.div`
  align-items: center;
  display: flex;
  height: calc(100% - 26px);
  justify-content: center;
  width: 100%;
`

const Footer = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;

  > button {
    margin-right: ${grid(1)};
  }
`
const Input = styled.input`
  border: 0;
  border-bottom: 1px dashed
    ${({ errors, errorId, touched }) =>
      errors[errorId] && touched[errorId] ? th('colorError') : th('colorText')};
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  outline: 0;
  padding: 0;
  width: 100%;

  &:focus {
    border-bottom: 1px dashed ${th('colorPrimary')};
    outline: 0;
  }
  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`
const Text = styled.div`
  color: #404040;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  margin-right: calc(3 * ${th('gridUnit')});
  min-width: 55px;
`
const Error = styled.div`
  color: ${th('colorError')};
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  height: ${th('lineHeightBase')};
  line-height: ${th('lineHeightBase')};
  min-height: ${th('lineHeightBase')};
  width: 100%;
`

const Container = styled.div`
  align-items: flex-start;
  display: flex;
  height: 90%;
  width: 90%;
  justify-content: space-between;
`
const Side1 = styled.div`
  display: flex;
  flex-basis: 8%;
  height: 100%;
`
const Side2 = styled.div`
  display: flex;
  flex-basis: 65%;
  flex-direction: column;
  height: 100%;
`
const FormFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`
const FormField = styled.div`
  align-items: flex-start;
  font-family: ${th('fontInterface')};
  display: flex;
  width: ${({ notFull }) => (notFull ? '98%' : '100%')};
  margin-bottom: calc(1 * ${th('gridUnit')});
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  height: calc(100% - 24px);
  width: 100%;
`
const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const Filename = styled(Text)`
  flex-grow: 1;
`
const FileList = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`

const Image = styled.img`
  height: 266px;
  width: 188px;
  margin-bottom: ${grid(1)};
`
class TemplateModal extends React.Component {
  constructor(props) {
    super(props)

    const { data, template } = props
    const { mode } = data

    this.updateFileList = this.updateFileList.bind(this)
    this.updateThumbnail = this.updateThumbnail.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.removeThumbnail = this.removeThumbnail.bind(this)
    this.handleSelectNotes = this.handleSelectNotes.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleSelectScripts = this.handleSelectScripts.bind(this)
    if (mode === 'create') {
      this.state = {
        error: false,
        name: undefined,
        thumbnailPreview: undefined,
        files: [],
        mode,
        target: undefined,
        notes: undefined,
        exportScripts: [],
      }
    } else {
      const {
        name,
        files,
        thumbnail,
        target,
        author,
        trimSize,
        notes,
        exportScripts,
      } = template

      this.state = {
        error: false,
        deleteThumbnail: undefined,
        deleteFiles: [],
        name,
        author,
        trimSize,
        thumbnail,
        thumbnailPreview: thumbnail ? thumbnail.source : undefined,
        files,
        mode,
        target: target ? find(selectOptions, { value: target }) : undefined,
        notes: notes ? find(noteSelectOptions, { value: notes }) : undefined,
        exportScripts,
      }
    }
  }

  updateFileList(fileList, setFieldValue, setFieldTouched) {
    const { files } = this.state
    const tempFiles = cloneDeep(files)
    const selectedFiles = tempFiles
    for (let i = 0; i < fileList.length; i += 1) {
      selectedFiles.push(fileList.item(i))
    }
    this.setState({ files: selectedFiles })
    setFieldValue('files', selectedFiles)
    setFieldTouched('files', true)
  }

  handleSelect(selected, setFieldValue, setFieldTouched) {
    this.setState({ target: selected })
    setFieldValue('target', selected)
    setFieldTouched('target', true)
  }

  handleSelectNotes(selected, setFieldValue, setFieldTouched) {
    this.setState({ notes: selected })
    setFieldValue('notes', selected)
    setFieldTouched('notes', true)
  }
  handleSelectScripts(selected, setFieldValue, setFieldTouched) {
    if (!selected) {
      this.setState({
        exportScripts: [],
      })
      setFieldValue('exportScripts', [])
      setFieldTouched('exportScripts', true)
    } else {
      setFieldValue('exportScripts', selected)
      setFieldTouched('exportScripts', true)
      this.setState({
        exportScripts: selected,
      })
    }
  }
  /* eslint-disable */
  updateThumbnail(file, setFieldValue, setFieldTouched) {
    const { thumbnail, mode } = this.state
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function(e) {
      let newState
      if (mode === 'update') {
        newState = {
          thumbnailPreview: reader.result,
          deleteThumbnail: thumbnail ? thumbnail.id : undefined,
          thumbnail: file,
        }
      } else {
        newState = { thumbnailPreview: reader.result, thumbnail: file }
      }
      this.setState(newState)
      setFieldValue('thumbnail', file)
      setFieldTouched('thumbnail', true)
    }.bind(this)
  }
  /* eslint-enable */
  removeFile(filename, setFieldValue, setFieldTouched) {
    const { files, mode, deleteFiles } = this.state
    let newState
    const tempFiles = cloneDeep(files)
    const tempDeleted = cloneDeep(deleteFiles)
    const fileIndex = findIndex(tempFiles, { name: filename })

    if (mode === 'update' && tempFiles[fileIndex].id) {
      const { id } = tempFiles[fileIndex]
      tempDeleted.push(id)
      files.splice(fileIndex, 1)

      newState = {
        deleteFiles: tempDeleted,
        files,
      }
    } else {
      files.splice(fileIndex, 1)
      newState = {
        files,
      }
    }

    setFieldValue('files', files)
    this.setState(newState)
    setFieldTouched('files', true)
  }

  removeThumbnail(setFieldValue, setFieldTouched) {
    const { thumbnail, mode } = this.state
    let newState
    setFieldValue('thumbnail', null)
    if (mode === 'update') {
      newState = {
        deleteThumbnail: thumbnail.id,
        thumbnailPreview: undefined,
        thumbnail: undefined,
      }
    } else {
      newState = {
        thumbnailPreview: undefined,
        thumbnail: undefined,
      }
    }
    this.setState(newState)
    setFieldTouched('thumbnail', true)
  }

  renderFiles(setFieldValue, setFieldTouched) {
    const { files } = this.state

    if (!files || files.length === 0) {
      return (
        <FormField>
          <Filename>No files selected</Filename>
        </FormField>
      )
    }

    return (
      <FileList>
        {files.map(file => (
          <FormField key={`${file.name}-${uniqueId()}`} notFull>
            <Filename>
              {file.extension
                ? `${file.name}.${file.extension}`
                : `${file.name}`}
            </Filename>
            <Button
              danger
              icon={deleteIcon}
              onClick={e => {
                e.preventDefault()
                this.removeFile(file.name, setFieldValue, setFieldTouched)
              }}
              title="Delete file"
            />
          </FormField>
        ))}
      </FileList>
    )
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, hideModal, mode, scriptOptions } = data
    const {
      thumbnailPreview,
      thumbnail,
      trimSize,
      author,
      name,
      files,
      target,
      notes,
      exportScripts,
    } = this.state

    const confirmLabel = mode === 'create' ? 'Save' : 'Update'
    const cancelLabel = 'Cancel'
    let filteredScriptOptions = []
    if (target) {
      filteredScriptOptions = scriptOptions.filter(script => {
        const { value } = script
        const tokens = value.split('-')
        return tokens[1].toLowerCase() === target.value.toLowerCase()
      })
    }

    let initialValues
    if (mode === 'create') {
      initialValues = {
        name: undefined,
        files: [],
        thumbnail: undefined,
        target: undefined,
        notes: undefined,
        author: undefined,
        trimSize: undefined,
        exportScripts: [],
      }
    } else {
      initialValues = {
        name,
        files,
        thumbnail,
        target,
        notes,
        author,
        trimSize,
        exportScripts,
      }
    }

    return (
      <StyledFormik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          const {
            name,
            author,
            trimSize,
            files,
            thumbnail,
            target,
            notes,
            exportScripts,
          } = values
          const { deleteFiles, deleteThumbnail, mode } = this.state
          let data

          if (mode === 'create') {
            data = {
              name,
              author,
              trimSize,
              files,
              thumbnail,
              target: target ? target.value : undefined,
              notes: notes ? notes.value : undefined,
              exportScripts,
            }
          } else {
            data = {
              name,
              author,
              deleteFiles,
              deleteThumbnail,
              trimSize,
              files: filter(files, file => !file.id),
              thumbnail: thumbnail && thumbnail.id ? null : thumbnail,
              target: target ? target.value : undefined,
              notes: notes ? notes.value : undefined,
              exportScripts,
            }
          }

          onConfirm(data)
          setSubmitting(false)
        }}
        validate={values => {
          const errors = {}
          const { files } = this.state
          if (!values.name || values.name === '') {
            errors.name = '* The name of the template should not be empty'
          }

          if (values.files.length > 0) {
            let stylesheetCounter = 0
            // const { files } = values
            for (let i = 0; i < files.length; i += 1) {
              if (
                files[i].type === 'text/css' ||
                files[i].mimetype === 'text/css'
              ) {
                stylesheetCounter += 1
              }
            }
            if (stylesheetCounter > 1) {
              errors.files =
                '* Only one stylesheet can be uploaded per Template'
            }
          }
          if (!values.target) {
            errors.target = '* The target of the template should not be empty'
          }
          if (!values.notes) {
            errors.notes =
              '* The notes type of the template should not be empty'
          }
          if (values.exportScripts.length > 0) {
            if (!values.target.value) {
              errors.exportScripts = '* You have to select a target first'
            } else {
              for (let i = 0; i < values.exportScripts.length; i += 1) {
                const { value } = values.exportScripts[i]
                const tokens = value.split('-')
                if (tokens[1].toLowerCase() !== target.value.toLowerCase()) {
                  errors.exportScripts =
                    '* The scope of the scripts should match the selected target'
                }
              }
            }
          }
          return errors
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          validateForm,
          isValid,
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Body>
              <Container>
                <Side1>
                  {!thumbnailPreview && (
                    <UploadThumbnail
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      updateThumbnail={this.updateThumbnail}
                      withIcon
                    />
                  )}

                  {thumbnailPreview && (
                    <ThumbnailContainer>
                      <Image
                        alt="Template's thumbnail"
                        src={thumbnailPreview}
                      />
                      <UploadThumbnail
                        setFieldTouched={setFieldTouched}
                        setFieldValue={setFieldValue}
                        updateThumbnail={this.updateThumbnail}
                      />
                      <Button
                        danger
                        label="Delete Thumbnail"
                        onClick={e => {
                          e.preventDefault()
                          this.removeThumbnail(setFieldValue, setFieldTouched)
                        }}
                        title="Delete Thumbnail"
                      />
                    </ThumbnailContainer>
                  )}
                </Side1>
                <Side2>
                  <FormField>
                    <Text>Name *</Text>
                    <FormFieldContainer>
                      <Input
                        errorId="name"
                        errors={errors}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onKeyPress={e => {
                          e.key === 'Enter' && e.preventDefault()
                        }}
                        placeholder="eg. Booksprints"
                        touched={touched}
                        type="text"
                        value={values.name || ''}
                      />
                      <Error>{touched.name ? errors.name : ''}</Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Author</Text>
                    <FormFieldContainer>
                      <Input
                        errorId="author"
                        errors={errors}
                        name="author"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onKeyPress={e => {
                          e.key === 'Enter' && e.preventDefault()
                        }}
                        placeholder="eg. John Smith"
                        touched={touched}
                        type="text"
                        value={values.author || ''}
                      />
                      <Error>{touched.author ? errors.author : ''}</Error>
                    </FormFieldContainer>
                  </FormField>
                  {/* <FormField>
                    <Text>Trim Size</Text>
                    <FormFieldContainer>
                      <Input
                        errorId="trimSize"
                        errors={errors}
                        name="trimSize"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onKeyPress={e => {
                          e.key === 'Enter' && e.preventDefault()
                        }}
                        placeholder="eg. 181 x 111 mm"
                        touched={touched}
                        type="text"
                        value={values.trimSize}
                      />
                      <Error>{errors.trimSize}</Error>
                    </FormFieldContainer>
                  </FormField> */}
                  <FormField>
                    <Text>Target *</Text>
                    <FormFieldContainer>
                      <Select
                        onChange={selected => {
                          this.handleSelect(
                            selected,
                            setFieldValue,
                            setFieldTouched,
                          )
                        }}
                        options={selectOptions}
                        value={values.target}
                      />
                      <Error>{touched.target ? errors.target : ''}</Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Scripts</Text>
                    <FormFieldContainer>
                      <Select
                        isDisabled={!values.target}
                        isMulti
                        onChange={selected => {
                          this.handleSelectScripts(
                            selected,
                            setFieldValue,
                            setFieldTouched,
                          )
                        }}
                        options={filteredScriptOptions}
                        value={values.exportScripts}
                      />
                      <Error>
                        {touched.exportScripts ? errors.exportScripts : ''}
                      </Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Notes *</Text>
                    <FormFieldContainer>
                      <Select
                        onChange={selected => {
                          this.handleSelectNotes(
                            selected,
                            setFieldValue,
                            setFieldTouched,
                          )
                        }}
                        options={noteSelectOptions}
                        value={values.notes}
                      />
                      <Error>{touched.notes ? errors.notes : ''}</Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Files</Text>

                    <UploadFilesButton
                      setFieldTouched={setFieldTouched}
                      setFieldValue={setFieldValue}
                      updateFilesList={this.updateFileList}
                    />
                  </FormField>
                  <Error>{touched.files ? errors.files : ''}</Error>
                  {this.renderFiles(setFieldValue, setFieldTouched)}
                </Side2>
              </Container>
            </Body>
            <Footer>
              <Button
                disabled={isSubmitting || !isEmpty(errors) || isEmpty(touched)}
                label={confirmLabel}
                title={confirmLabel}
                type="submit"
              />
              <Button
                danger
                label={cancelLabel}
                onClick={hideModal}
                title={cancelLabel}
              />
            </Footer>
          </StyledForm>
        )}
      </StyledFormik>
    )
  }

  render() {
    const { isOpen, hideModal, data } = this.props
    const { headerText } = data
    const body = this.renderBody()

    return (
      <FormModal
        headerText={headerText}
        isOpen={isOpen}
        onRequestClose={hideModal}
        size="largeNarrow"
      >
        {body}
      </FormModal>
    )
  }
}

export default TemplateModal
