/* eslint-disable react/prop-types */

import React from 'react'
import { Form, Formik } from 'formik'
import isFunction from 'lodash/isFunction'

const FormHelper = props => {
  const { children, ...other } = props
  return (
    <Formik {...other}>
      {formikProps => (
        <Form>
          {isFunction(children)
            ? children({ ...formikProps, ...other })
            : children}
        </Form>
      )}
    </Formik>
  )
}

export default FormHelper
