import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import { Button } from '@pubsweet/ui'
import { Formik } from 'formik'

const Input = styled.input`
  &:placeholder-shown {
    font-size: 13px !important;
  }
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
    console.log('1')
    const { data } = this.props
    const { onConfirm } = data
    const title = event.target.value.trim()
    console.log('hello', title)
    if (title.length === 0) {
      return this.setState({
        error: true,
      })
    } else {
      this.setState({
        error: false,
      })
    }
    this.setState({ title })
    if (event.charCode !== 13) return
    onConfirm(title)
  }

  /* eslint-disable */
  onCreate() {
    const { data, hideModal } = this.props
    console.log('asdasdfdsa', this.props)
    const { collectionId, createBook } = data
    const input = this.textInput
    const newTitle = input.value.trim()

    if (newTitle.length === 0) {
      return this.setState({
        error: true,
      })
    }

    createBook({
      variables: {
        input: {
          collectionId,
          title: newTitle,
        },
      },
    })

    hideModal()
  }
  /* eslint-enable */

  onInputChange(event) {
    const { error } = this.state
    const title = event.target.value.trim()
    console.log('t', title)
    if (title.length === 0) {
      this.setState({ error: true })
    }
    if (!error) return
    this.setState({ error: false })
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm } = data
    const message = (
      <div style={{ paddingBottom: 4 }}>
        Enter the title of the new book <br />
      </div>
    )

    return (
      <div>
        <Formik
          initialValues={{ title: '' }}
          validate={values => {
            let errors = {}
            if (!values.title) {
              errors.title = 'Required'
            }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            // setTimeout(() => {
            //   alert(JSON.stringify(values, null, 2))
            //   setSubmitting(false)
            // }, 400)
            onConfirm(values.title)
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
                {message}
                <Input
                  autoFocus
                  type="text"
                  name="title"
                  placeholder="eg. My new title"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.title}
                />
                {errors.title && touched.title && errors.title}
              </ModalBody>
              <ModalFooter>
                <Button type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </div>
    )
  }

  renderError() {
    const { error } = this.state

    const el = <div className="error">New book title cannot be empty</div>

    const res = error ? el : null
    return res
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
