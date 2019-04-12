import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import { Button } from '@pubsweet/ui'
import { Formik } from 'formik'

const Input = styled.input`
  font-size: 14px;
  &:placeholder-shown {
    font-size: 13px !important;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  justify-content: space-evenly;
  > label,
  input {
    margin-top: 8px;
  }
  > label:first-child {
    margin-top: 0;
  }
`

class MetadataModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = { error: false, title: '' }
  }

  renderBody() {
    const { data } = this.props
    const { onConfirm, book } = data
    console.log('props', this.props)
    return (
      <div>
        <Formik
          initialValues={{
            edition: book.edition,
            copyrightStatement: book.copyrightStatement,
            copyrightYear: book.copyrightYear,
            copyrightHolder: book.copyrightHolder,
            license: book.license,
            isbn: book.isbn,
            issn: book.issn,
            issnL: book.issnL,
            publicationDate: book.publicationDate,
          }}
          validate={values => {
            let errors = {}
            // if (!values.title) {
            //   errors.title = 'Required'
            // }
            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            // setTimeout(() => {
            //   alert(JSON.stringify(values, null, 2))
            //   setSubmitting(false)
            // }, 400)
            onConfirm(values)
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
                <Container>
                  <label htmlFor="edition">Edition</label>
                  <Input
                    type="number"
                    id="edition"
                    name="edition"
                    placeholder="eg. 1"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.edition}
                  />
                  {errors.edition && touched.edition && errors.edition}
                  <label htmlFor="copyrightStatement">
                    Copyright Statement
                  </label>
                  <Input
                    type="text"
                    id="copyrightStatement"
                    name="copyrightStatement"
                    placeholder="eg. Some statement"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.copyrightStatement}
                  />
                  {errors.copyrightStatement &&
                    touched.copyrightStatement &&
                    errors.copyrightStatement}
                  <label htmlFor="copyrightYear">Copyright Year</label>
                  <Input
                    type="number"
                    id="copyrightYear"
                    name="copyrightYear"
                    placeholder="eg. 2018"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.copyrightYear}
                  />
                  {errors.copyrightYear &&
                    touched.copyrightYear &&
                    errors.copyrightYear}
                  <label htmlFor="copyrightHolder">Copyright Holder</label>
                  <Input
                    type="text"
                    id="copyrightHolder"
                    name="copyrightHolder"
                    placeholder="eg. University of California"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.copyrightHolder}
                  />
                  {errors.copyrightHolder &&
                    touched.copyrightHolder &&
                    errors.copyrightHolder}
                  <label htmlFor="license">License</label>
                  <Input
                    type="text"
                    id="license"
                    name="license"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.license}
                  />
                  {errors.license && touched.license && errors.license}
                  <label htmlFor="isbn">ISBN</label>
                  <Input
                    type="text"
                    id="isbn"
                    name="isbn"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.isbn}
                  />
                  {errors.isbn && touched.isbn && errors.isbn}
                  <label htmlFor="issn">ISSN</label>
                  <Input
                    type="text"
                    id="issn"
                    name="issn"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.issn}
                  />
                  {errors.issn && touched.issn && errors.issn}
                  <label htmlFor="issnL">ISSN-L</label>
                  <Input
                    type="text"
                    id="issnL"
                    name="issnL"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.isbnL}
                  />
                  {errors.issnL && touched.issnL && errors.issnL}
                  <label htmlFor="publicationDate">Publication Date</label>
                  <Input
                    type="date"
                    id="publicationDate"
                    name="publicationDate"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.publicationDate}
                  />
                  {errors.publicationDate &&
                    touched.publicationDate &&
                    errors.publicationDate}
                </Container>
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

  render() {
    const { isOpen, hideModal } = this.props
    const body = this.renderBody()

    return (
      <FormModal
        isOpen={isOpen}
        headerText="Book Metadata"
        size="medium"
        onRequestClose={hideModal}
      >
        {body}
      </FormModal>
    )
  }
}

export default MetadataModal
