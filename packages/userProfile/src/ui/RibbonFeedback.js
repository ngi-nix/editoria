/* eslint-disable react/prop-types */

import React, { Fragment, useState } from 'react'

import Ribbon from './Ribbon'

const RibbonFeedback = props => {
  const { successMessage, children, timeout, ...rest } = props

  /*
    Keep a timer id for each instance of RibbonFeedback, so that they can be
    cleared / reset correctly, as well as independently of other instances.
  */

  const [timer, setTimer] = useState(undefined)
  const [showRibbon, setShowRibbon] = useState(false)
  const [successStatus, setSuccessStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const notifyRibbon = (success, message) => {
    clearTimeout(timer)

    setShowRibbon(true)
    setSuccessStatus(success)
    if (!success) setErrorMessage(message)

    setTimer(
      setTimeout(() => {
        setShowRibbon(false)
        setSuccessStatus(null)
        setErrorMessage(null)
      }, timeout || 4000),
    )
  }

  const getMessage = () => {
    if (!showRibbon) return null
    if (successStatus === true) return successMessage
    if (successStatus === false) return errorMessage
    return null
  }

  return (
    <Fragment>
      <Ribbon
        message={getMessage()}
        status={successStatus ? 'success' : 'error'}
        {...rest}
      />

      {children(notifyRibbon)}
    </Fragment>
  )
}

export default RibbonFeedback
