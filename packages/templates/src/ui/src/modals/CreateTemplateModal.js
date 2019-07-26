import React from 'react'
import styled from 'styled-components'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import { keys, findKey, without, pick, findIndex } from 'lodash'
import { Formik } from 'formik'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import Select from 'react-select'
import {
  UploadFilesButton,
  ButtonWithoutLabel,
  DefaultButton,
  UploadThumbnail,
} from '../../../ui'

const StyledModal = styled(ModalBody)`
  align-items: flex-start;
  display: flex;
  height: 82%;
  justify-content: center;
`
const Input = styled.input`
  width: 100%;
  line-height: ${th('lineHeightBase')};
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  border: 0;
  padding: 0;
  outline: 0;
  border-bottom: 1px dashed
    ${({ errors, errorId, touched }) => {
      console.log('asdfasdf', errorId)
      console.log('asdfasdf', errors)
      return errors[errorId] && touched[errorId]
        ? th('colorError')
        : th('colorText')
    }};

  &:focus {
    outline: 0;
    border-bottom: 1px dashed ${th('colorPrimary')};
  }
  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`
const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  margin-right: calc(3 * ${th('gridUnit')});
  line-height: ${th('lineHeightBase')};
  min-width: 55px;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const Error = styled.div`
  font-family: 'Fira Sans Condensed';
  height: ${th('lineHeightBase')};
  min-height: ${th('lineHeightBase')};
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: ${th('colorError')};
`

const ConfirmButton = styled.button`
  align-items: center;
  cursor: pointer;
  background: ${th('colorPrimary')};
  border: none;
  color: white;
  display: flex;
  margin-bottom:8px;
  padding: calc(${th('gridUnit')}/2) calc(3 * ${th('gridUnit')});
  /* border-bottom: 1px solid ${th('colorBackground')}; */
  &:disabled {
    background:#ccc;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background: ${lighten('colorPrimary', 10)};
  }
  &:not(:disabled):active {
    background: ${darken('colorPrimary', 10)};
    border: none;
    outline: none;
  }
  &:focus {
    background: ${darken('colorPrimary', 10)};
    outline: 0;
  }
`
const CancelButton = styled.button`
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  color: #828282;
  display: flex;
  padding: 0;
  border-bottom: 1px solid ${th('colorBackground')};

  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
  }
  &:not(:disabled):active {
    border: none;
    color: ${th('colorPrimary')};
    outline: none;
    border-bottom: 1px solid ${th('colorPrimary')};
  }
  &:focus {
    outline: 0;
  }
`
const Label = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  font-weight: normal;
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  height: 97%;
  justify-content: space-between;
  flex-basis: 80%;
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
  display: flex;
  margin-bottom: calc(1 * ${th('gridUnit')});
`

const StyledForm = styled.form`
  height: 94%;
`

const ThumbnailContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const deleteIcon = (
  <svg
    fill="none"
    height="16"
    viewBox="0 0 16 16"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="delete">
      <path
        d="M5.60005 12C6.04005 12 6.40005 11.64 6.40005 11.2V8C6.40005 7.56 6.04005 7.2 5.60005 7.2C5.16005 7.2 4.80005 7.56 4.80005 8V11.2C4.80005 11.64 5.16005 12 5.60005 12Z"
        fill="#828282"
      />
      <path
        d="M10.4 12C10.84 12 11.2 11.64 11.2 11.2V8C11.2 7.56 10.84 7.2 10.4 7.2C9.96 7.2 9.6 7.56 9.6 8V11.2C9.6 11.64 9.96 12 10.4 12Z"
        fill="#828282"
      />
      <path
        clipRule="evenodd"
        d="M15.2 3.2C15.64 3.2 16 3.56 16 4C16 4.44 15.64 4.8 15.2 4.8H14.4V13.6C14.4 14.9232 13.3232 16 12 16H4C2.6768 16 1.6 14.9232 1.6 13.6V4.8H0.8C0.36 4.8 0 4.44 0 4C0 3.56 0.36 3.2 0.8 3.2H4.8V1.8624C4.8 0.8352 5.6968 0 6.8 0H9.2C10.3032 0 11.2 0.8352 11.2 1.8624V3.2H15.2ZM12 14.4C12.4416 14.4 12.8 14.0408 12.8 13.6V4.8H3.19995V13.6C3.19995 14.0408 3.55835 14.4 3.99995 14.4H12ZM6.3999 1.86241C6.3999 1.73841 6.5711 1.60001 6.7999 1.60001H9.1999C9.4287 1.60001 9.5999 1.73841 9.5999 1.86241V3.20001H6.3999V1.86241Z"
        fill="#828282"
        fillRule="evenodd"
      />
    </g>
  </svg>
)

const Filename = styled(Text)`
  flex-grow: 1;
`

const Image = styled.img`
  height: 266px;
  width: 188px;
`
class CreateTemplateModal extends React.Component {
  constructor(props) {
    super(props)

    this.updateFileList = this.updateFileList.bind(this)
    this.updateThumbnail = this.updateThumbnail.bind(this)
    this.removeFile = this.removeFile.bind(this)
    this.removeThumbnail = this.removeThumbnail.bind(this)

    this.state = {
      error: false,
      name: '',
      thumbnailPreview: undefined,
      files: [],
      mode: 'create',
      target: undefined,
    }
  }

  updateFileList(fileList, setFieldValue, setFieldTouched) {
    const { files } = this.state
    const selectedFiles = files
    for (let i = 0; i < fileList.length; i += 1) {
      selectedFiles.push(fileList.item(i))
    }
    this.setState({ files: selectedFiles })
    setFieldValue('files', fileList)
    setFieldTouched('files', true)
  }

  handleSelect(selected) {
    this.setState({ target: selected })
  }

  updateThumbnail(thumbnail, setFieldValue) {
    const reader = new FileReader()
    reader.readAsDataURL(thumbnail)

    reader.onloadend = function(e) {
      this.setState({
        thumbnailPreview: reader.result,
        thumbnail,
      })
      setFieldValue('thumbnail', thumbnail  )
    }.bind(this)
  }

  removeFile(filename, setFieldValue, setFieldTouched) {
    const { files } = this.state
    const fileIndex = findIndex(files, { name: filename })
    files.splice(fileIndex, 1)
    setFieldValue('files', files)
    this.setState({ files })
    setFieldTouched('files', true)
  }

  removeThumbnail(e) {
    e.preventDefault()
    this.setState({
      thumbnailPreview: undefined,
      thumbnail: undefined,
    })
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
    return files.map(file => (
      <FormField>
        <Filename>{file.name}</Filename>
        <ButtonWithoutLabel
          icon={deleteIcon}
          onClick={e => {
            e.preventDefault()
            this.removeFile(file.name, setFieldValue, setFieldTouched)
          }}
        />
      </FormField>
    ))
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, hideModal } = data
    const { thumbnailPreview } = this.state

    const confirmLabel = 'Add'
    const cancelLabel = 'Cancel'
    const selectOptions = [
      { label: 'EPUB', value: 'epub' },
      { label: 'PagedJS', value: 'pagedjs' },
      { label: 'VivlioStyle', value: 'vivliostyle' },
    ]

    return (
      <Formik
        initialValues={{
          name: undefined,
          files: [],
          thumbnail: undefined,
          target: undefined,
          author: undefined,
          trimSize: undefined,
        }}
        onSubmit={(values, { setSubmitting }) => {
          const { name, author, trimSize, files, thumbnail, target } = values
          console.log('values', values)
          const data = {
            name,
            author,
            trimSize,
            files,
            thumbnail,
            target: target ? target.value : undefined,
          }
          console.log('data', data)
          onConfirm(data).then(() => {
            setSubmitting(false)
            hideModal()
          })
        }}
        validate={values => {
          const errors = {}
          if (!values.name) {
            errors.name = '* The name of the template should not be empty'
          }
          if (values.files.length > 0) {
            let stylesheetCounter = 0
            const { files } = values
            for (let i = 0; i < files.length; i += 1) {
              if (files[i].type === 'text/css') {
                stylesheetCounter += 1
              }
            }
            if (stylesheetCounter > 1) {
              errors.files =
                '* Only one stylesheet can be uploaded per Template'
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
          isValid,
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <StyledModal>
              <Container>
                <Side1>
                  {!thumbnailPreview && (
                    <UploadThumbnail
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
                        setFieldValue={setFieldValue}
                        updateThumbnail={this.updateThumbnail}
                      />
                      <DefaultButton
                        label="Delete Thumbnail"
                        onClick={this.removeThumbnail}
                        setFieldValue={setFieldValue}
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
                        touched={touched}
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="eg. Booksprints"
                        type="text"
                        value={values.name}
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
                        touched={touched}
                        name="author"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="eg. John Smith"
                        type="text"
                        value={values.author}
                      />
                      <Error>{errors.author}</Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Trim Size</Text>
                    <FormFieldContainer>
                      <Input
                        errorId="trimSize"
                        touched={touched}
                        errors={errors}
                        name="trimSize"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="eg. 181 x 111 mm"
                        type="text"
                        value={values.trimSize}
                      />
                      <Error>{errors.trimSize}</Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Target</Text>
                    <FormFieldContainer>
                      <Select
                        onChange={selected => {
                          this.handleSelect(selected)
                          setFieldValue('target', selected)
                        }}
                        options={selectOptions}
                        selected={this.state.selected}
                      />
                      <Error>{errors.target}</Error>
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
                  <Error>{errors.files}</Error>
                  {this.renderFiles(setFieldValue, setFieldTouched)}
                </Side2>
              </Container>
            </StyledModal>
            <ModalFooter>
              <ConfirmButton disabled={isSubmitting || !isValid} type="submit">
                <Label>{confirmLabel.toUpperCase()}</Label>
              </ConfirmButton>
              <CancelButton onClick={hideModal} type="submit">
                <Label>{cancelLabel}</Label>
              </CancelButton>
            </ModalFooter>
          </StyledForm>
        )}
      </Formik>
    )
  }

  render() {
    const { isOpen, hideModal } = this.props
    const body = this.renderBody()

    return (
      <FormModal
        headerText="Create a new Template"
        isOpen={isOpen}
        onRequestClose={hideModal}
        size="largeNarrow"
      >
        {body}
      </FormModal>
    )
  }
}

export default CreateTemplateModal
