import React from 'react'
import PropTypes from 'prop-types'

import AbstractModal from 'editoria-common/src/AbstractModal'

class ErrorModal extends React.Component {
  /* eslint-disable */
  renderBody() {
    return (
      <div>
        An error occurred during the conversion to epub. Please try again later.
      </div>
    )
  }
  /* eslint-enable */

  render() {
    const { container, show, toggle } = this.props
    const body = this.renderBody()
    const title = 'An error occurred'

    return (
      <AbstractModal
        body={body}
        container={container}
        show={show}
        title={title}
        toggle={toggle}
      />
    )
  }
}

ErrorModal.propTypes = {
  container: PropTypes.any.isRequired,
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default ErrorModal
