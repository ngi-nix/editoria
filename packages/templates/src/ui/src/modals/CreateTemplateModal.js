import React from 'react'
import styled from 'styled-components'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import { UploadFilesButton } from '../../../ui'
// import { Button } from '@pubsweet/ui'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'

const StyledModal = styled(ModalBody)`
  display: flex;
  height: 82%;
  align-items: flex-start;
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
  /* text-align: center; */
  border-bottom: 1px dashed
    ${({ errors }) => (errors.name ? th('colorError') : th('colorText'))};

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
  text-align: right;
  margin-right: calc(3 * ${th('gridUnit')});
  line-height: ${th('lineHeightBase')};
  width: 24%;
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
  justify-content: center;
  flex-basis: 80%;
`
const Side1 = styled.div`
  flex-basis: 25%;
  height: 100%;
  display: flex;
  padding: calc(2 * ${th('gridUnit')});
  align-items: center;
  justify-content: center;
`
const Side2 = styled.div`
  flex-basis: 75%;
  display: flex;
  flex-direction: column;
  height: 100%;
  /* align-items: center; */
  justify-content: center;
`
const FormFieldContainer = styled.div`
  display: flex;
  flex-grow:1;
  /* margin-bottom: calc(1 * ${th('gridUnit')});/ */
  flex-direction: column;
`
const FormField = styled.div`
  display: flex;
  margin-bottom: calc(1 * ${th('gridUnit')});
  /* align-items: center; */
  /* justify-content: center; */
  /* flex-basis: 100%; */
`

const StyledForm = styled.form`
  height: 94%;
`
const ImagePlaceholder = styled.div`
  height: 266px;
  width: 188px;
  background: grey;
`

const Header = styled.h3`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeHeading3')};
  line-height: ${th('lineHeightHeading3')};
  font-weight: normal;
  margin: 0 0 calc(2 * ${th('gridUnit')}) 0;
  padding: 0;
  text-align: center;
`
class CreateTemplateModal extends React.Component {
  constructor(props) {
    super(props)

    // this.handleKeyOnInput = this.handleKeyOnInput.bind(this)
    // this.onInputChange = this.onInputChange.bind(this)
    // this.onCreate = this.onCreate.bind(this)
    this.updateFileList = this.updateFileList.bind(this)

    this.state = { error: false, name: '', thumbnail: {}, files: {} }
  }

  updateFileList(files) {
    this.setState({ files })
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, hideModal } = data

    const confirmLabel = 'Add'
    const cancelLabel = 'Cancel'

    return (
      <Formik
        initialValues={{ name: '' }}
        validate={values => {
          let errors = {}
          if (!values.name) {
            errors.name = '* The name of the template should not be empty'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          // setTimeout(() => {
          //   alert(JSON.stringify(values, null, 2))
          //   setSubmitting(false)
          // }, 400)
          const name = values.name
          onConfirm(name.trim())
          setSubmitting(false)
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
          /* and other goodies */
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <StyledModal>
              <Container>
                <Side1>
                  <ImagePlaceholder />
                </Side1>
                <Side2>
                  <Header>Information</Header>
                  <FormField>
                    <Text>Name</Text>
                    <FormFieldContainer>
                      <Input
                        type="text"
                        errors={errors}
                        name="name"
                        placeholder="eg. Booksprints"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                      />
                      <Error>
                        {errors.name && touched.name && errors.name}
                      </Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Author</Text>
                    <FormFieldContainer>
                      <Input
                        type="text"
                        errors={errors}
                        name="author"
                        placeholder="eg. John Smith"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.author}
                      />
                      <Error>
                        {errors.author && touched.author && errors.author}
                      </Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Trim Size</Text>
                    <FormFieldContainer>
                      <Input
                        type="text"
                        errors={errors}
                        name="trimSize"
                        placeholder="eg. 181 x 111 mm"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.trimSize}
                      />
                      <Error>
                        {errors.trimSize && touched.trimSize && errors.trimSize}
                      </Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Target</Text>
                    <FormFieldContainer>
                      <Input
                        type="text"
                        errors={errors}
                        name="target"
                        placeholder="eg. Select"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.target}
                      />
                      <Error>
                        {errors.target && touched.target && errors.target}
                      </Error>
                    </FormFieldContainer>
                  </FormField>
                  <FormField>
                    <Text>Files</Text>

                    <UploadFilesButton updateFilesList={this.updateFileList} />
                  </FormField>
                  <FormField>
                    {this.state.files.map(file=>{
                      
                    })}
                  </FormField>
                </Side2>
              </Container>
            </StyledModal>
            <ModalFooter>
              <ConfirmButton
                type="submit"
                disabled={isSubmitting || errors.name}
              >
                <Label>{confirmLabel.toUpperCase()}</Label>
              </ConfirmButton>
              <CancelButton type="submit" onClick={hideModal}>
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
    console.log('props', this.props)
    console.log('state', this.state)
    const body = this.renderBody()

    return (
      <FormModal
        isOpen={isOpen}
        headerText="Create a new Template"
        size="largeNarrow"
        onRequestClose={hideModal}
      >
        {body}
      </FormModal>
    )
  }
}

export default CreateTemplateModal
