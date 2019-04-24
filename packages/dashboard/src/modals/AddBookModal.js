import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
// import { Button } from '@pubsweet/ui'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'

const Input = styled.input`
  width: 100%;
  line-height: ${th('lineHeightBase')};
  font-size: ${th('fontSizeBase')};
  border: 0;
  outline: 0;
  text-align: center;
  margin-bottom: calc(${th('gridUnit')});
  border-bottom: 1px dashed
    ${({ errors }) => (errors.title ? th('colorError') : th('colorText'))};

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
  text-align: center;
  margin-bottom: calc(3 * ${th('gridUnit')});
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const Error = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: left;
  height: ${th('lineHeightBase')};
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
class AddBookModal extends React.Component {
  constructor(props) {
    super(props)

    this.handleKeyOnInput = this.handleKeyOnInput.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onCreate = this.onCreate.bind(this)

    this.state = { error: false, title: '' }
  }

  // focusTextInput() {
  //   if (this.textInput) this.textInput.focus()
  // }

  // componentDidMount() {
  //   const { show } = this.props
  //   console.log('did update', this.textInput)
  //   if (show) this.focusTextInput()
  // }

  // TODO -- figure out how to make input ref auto focus work when we move away from bootstrap modals

  handleKeyOnInput(event) {
    // console.log('1')
    // const { data } = this.props
    // const { onConfirm } = data
    // const title = event.target.value.trim()
    // console.log('hello', title)
    // if (title.length === 0) {
    //   return this.setState({
    //     error: true,
    //   })
    // } else {
    //   this.setState({
    //     error: false,
    //   })
    // }
    // this.setState({ title })
    // if (event.charCode !== 13) return
    // onConfirm(title)
  }

  /* eslint-disable */
  onCreate() {
    // const { data, hideModal } = this.props
    // console.log('asdasdfdsa', this.props)
    // const { collectionId, createBook } = data
    // const input = this.textInput
    // const newTitle = input.value.trim()
    // if (newTitle.length === 0) {
    //   return this.setState({
    //     error: true,
    //   })
    // }
    // createBook({
    //   variables: {
    //     input: {
    //       collectionId,
    //       title: newTitle,
    //     },
    //   },
    // })
    // hideModal()
  }
  /* eslint-enable */

  onInputChange(event) {
    // const { error } = this.state
    // const title = event.target.value.trim()
    // console.log('t', title)
    // if (title.length === 0) {
    //   this.setState({ error: true })
    // }
    // if (!error) return
    // this.setState({ error: false })
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, hideModal } = data

    const confirmLabel = 'Save'
    const cancelLabel = 'Cancel'

    return (
      <div>
        <Formik
          initialValues={{ title: '' }}
          validate={values => {
            let errors = {}
            if (!values.title) {
              errors.title = '* The title of the book should not be empty'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            // setTimeout(() => {
            //   alert(JSON.stringify(values, null, 2))
            //   setSubmitting(false)
            // }, 400)
            const title = values.title
            onConfirm(title.trim())
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
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <Text>Enter the title of the new book</Text>
                <Input
                  type="text"
                  errors={errors}
                  name="title"
                  placeholder="eg. My new title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                />
                <Error>{errors.title && touched.title && errors.title}</Error>
              </ModalBody>
              <ModalFooter>
                <ConfirmButton
                  type="submit"
                  disabled={isSubmitting || errors.title}
                >
                  <Label>{confirmLabel.toUpperCase()}</Label>
                </ConfirmButton>
                <CancelButton type="submit" onClick={hideModal}>
                  <Label>{cancelLabel}</Label>
                </CancelButton>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </div>
    )
  }

  render() {
    const { isOpen, hideModal } = this.props
    console.log('props', this.props)
    const body = this.renderBody()

    return (
      <FormModal
        isOpen={isOpen}
        headerText="Create a new Book"
        size="small"
        onRequestClose={hideModal}
      >
        {body}
      </FormModal>
    )
  }
}

AddBookModal.propTypes = {
  collectionId: PropTypes.string.isRequired,
  create: PropTypes.func.isRequired,
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default AddBookModal
