import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'
import { Formik } from 'formik'

import { Button } from '../../../../ui'
import FormModal from '../../../common/src/FormModal'

const Input = styled.input`
  width: 100%;
  line-height: ${th('lineHeightBase')};
  font-size: ${th('fontSizeBase')};
  font-family: ${th('fontInterface')};
  color: ${th('colorText')};
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
  font-family: ${th('fontInterface')};
  text-align: center;
  margin-bottom: ${grid(3)};
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: ${th('colorText')};
`

const Error = styled.div`
  font-family: ${th('fontInterface')};
  text-align: left;
  height: ${th('lineHeightBase')};
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: ${th('colorError')};
`

const StyledFormik = styled(Formik)`
  width: 100%;
  height: 100%;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
`

const Body = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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

class AddBookModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: false, title: '' }
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, hideModal } = data

    const confirmLabel = 'Save'
    const cancelLabel = 'Cancel'

    return (
      <StyledFormik
        initialValues={{ title: '' }}
        onSubmit={(values, { setSubmitting }) => {
          const { title } = values

          onConfirm(title.trim())
          setSubmitting(false)
        }}
        validate={values => {
          const errors = {}

          if (!values.title) {
            errors.title = '* The title of the book should not be empty'
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
          /* and other goodies */
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Body>
              <Text>Enter the title of the new book</Text>
              <Input
                errors={errors}
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                placeholder="eg. My new title"
                type="text"
                value={values.title}
              />
              <Error>{errors.title && touched.title && errors.title}</Error>
            </Body>
            <Footer>
              <Button
                disabled={isSubmitting || errors.title}
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
    const { isOpen, hideModal } = this.props

    const body = this.renderBody()

    return (
      <FormModal
        headerText="Create a new Book"
        isOpen={isOpen}
        onRequestClose={hideModal}
        size="small"
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
