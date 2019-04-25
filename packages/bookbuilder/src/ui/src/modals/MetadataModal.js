import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import FormModal from 'editoria-common/src/FormModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import { Button } from '@pubsweet/ui'
import { Formik } from 'formik'

const Text = styled.div`
  font-family: 'Fira Sans Condensed';
  text-align: center;
  line-height: ${th('lineHeightBase')};
  width: 100%;
  font-size: ${th('fontSizeBase')};
  color: #404040;
`
const Label = styled.label`
  font-family: 'Fira Sans Condensed';
  line-height: ${th('lineHeightBase')};
  font-size: ${th('fontSizeBase')};
  justify-content: flex-end;
  flex-basis: 30%;
  text-align: right;
  margin-right: 18px;
  color: #757575;
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
const ButtonLabel = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  font-weight: normal;
`

const Input = styled.input`
  flex-basis: 70%;
  font-family: 'Fira Sans Condensed';
  line-height: ${th('lineHeightBase')};
  font-size: ${th('fontSizeBase')};
  border: 0;
  outline: 0;
  margin-bottom: calc(${th('gridUnit')});
  border-bottom: 1px dashed ${th('colorText')};

  &:focus {
    outline: 0;
    border-bottom: 1px dashed ${th('colorPrimary')};
  }
  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`

const Row = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
`
const Container = styled.div`
  display: flex;

  margin: 0 auto;
  flex-direction: column;
  width: 70%;
  font-size: 18px;
  justify-content: space-evenly;
`

class MetadataModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = { error: false, title: '' }
  }

  renderBody() {
    const { data, hideModal } = this.props
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
            // if (values.edition<1) {
            //   errors.edition = 'Should be greater or equal to 1'
            // }
            // return errors
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
                <Text>{book.title}</Text>
                <br />
                <Container>
                  <Row>
                    <Label htmlFor="edition">Edition</Label>
                    <Input
                      type="number"
                      id="edition"
                      name="edition"
                      min={0}
                      max={100}
                      placeholder="eg. 1"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.edition}
                    />
                    {errors.edition && touched.edition && errors.edition}
                  </Row>
                  <Row>
                    <Label htmlFor="copyrightStatement">
                      Copyright Statement
                    </Label>
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
                  </Row>
                  <Row>
                    <Label htmlFor="copyrightYear">Copyright Year</Label>
                    <Input
                      type="number"
                      id="copyrightYear"
                      name="copyrightYear"
                      placeholder="eg. 2018"
                      min={1900}
                      max={10000000}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.copyrightYear}
                    />
                    {errors.copyrightYear &&
                      touched.copyrightYear &&
                      errors.copyrightYear}
                  </Row>
                  <Row>
                    <Label htmlFor="copyrightHolder">Copyright Holder</Label>
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
                  </Row>
                  <Row>
                    <Label htmlFor="license">License</Label>
                    <Input
                      type="text"
                      id="license"
                      name="license"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.license}
                    />
                    {errors.license && touched.license && errors.license}
                  </Row>
                  <Row>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      type="text"
                      id="isbn"
                      name="isbn"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.isbn}
                    />
                    {errors.isbn && touched.isbn && errors.isbn}
                  </Row>
                  <Row>
                    <Label htmlFor="issn">ISSN</Label>
                    <Input
                      type="text"
                      id="issn"
                      name="issn"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.issn}
                    />
                    {errors.issn && touched.issn && errors.issn}
                  </Row>
                  <Row>
                    <Label htmlFor="issnL">ISSN-L</Label>
                    <Input
                      type="text"
                      id="issnL"
                      name="issnL"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.isbnL}
                    />
                    {errors.issnL && touched.issnL && errors.issnL}
                  </Row>
                  <Row>
                    <Label htmlFor="publicationDate">Publication Date</Label>
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
                  </Row>
                </Container>
              </ModalBody>
              <ModalFooter>
                <ConfirmButton type="submit" disabled={isSubmitting}>
                  <ButtonLabel>Save Metadata</ButtonLabel>
                </ConfirmButton>
                <CancelButton type="submit" onClick={hideModal}>
                  <ButtonLabel>Cancel</ButtonLabel>
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
