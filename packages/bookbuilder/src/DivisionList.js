import { map } from 'lodash'

import React, { Component } from 'react'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import Division from './Division'

class DivisionList extends Component {
  constructor(props) {
    super(props)
    this.renderDivision = this.renderDivision.bind(this)
  }

  renderDivision(reorderingAllowed, bookComponents, label, id) {
    const {
      user,
      addBookComponent,
      deleteBookComponent,
      updateBookComponentPagination,
      updateBookComponentOrder,
      updateBookComponentWorkflowState,
      bookId,
      outerContainer,
      uploading,
    } = this.props
    return (
      <Division
        add={addBookComponent}
        bookComponents={bookComponents}
        bookId={bookId}
        deleteBookComponent={deleteBookComponent}
        divisionId={id}
        ink={() => {
          console.log('ink')
        }}
        key={id}
        label={label}
        outerContainer={outerContainer}
        reorderingAllowed={reorderingAllowed}
        update={() => {
          console.log('update')
        }}
        updateBookComponentOrder={updateBookComponentOrder}
        updateBookComponentPagination={updateBookComponentPagination}
        updateBookComponentWorkflowState={updateBookComponentWorkflowState}
        uploadStatus={uploading}
        user={user}
      />
    )
  }
  render() {
    const { bookId, divisions } = this.props
    return map(divisions, division => {
      const { bookComponents, label, id } = division
      return (
        <Authorize
          object={bookId}
          operation="can reorder bookComponents"
          unauthorized={this.renderDivision(false, bookComponents, label, id)}
        >
          {this.renderDivision(true, bookComponents, label, id)}
        </Authorize>
      )
    })
  }
}

export default DivisionList
