import React from 'react'
import styled from 'styled-components'
import { map } from 'lodash'
import { th } from '@pubsweet/ui-toolkit'
import Division from './Division'
// import Authorize from 'pubsweet-client/src/helpers/Authorize'
const DivisionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const DivisionsArea = ({
  bookId,
  divisions,
  history,
  addBookComponent,
  addBookComponents,
  deleteBookComponent,
  updateBookComponentPagination,
  updateBookComponentOrder,
  updateBookComponentWorkflowState,
  updateBookComponentContent,
  updateBookComponentUploading,
  outerContainer,
  showModal,
  showModalToggle,
  uploading,
}) => {
  const renderDivision = (reorderingAllowed, bookComponents, label, id) => {
    return (
      <Division
        add={addBookComponent}
        addBookComponents={addBookComponents}
        bookComponents={bookComponents}
        bookId={bookId}
        deleteBookComponent={deleteBookComponent}
        divisionId={id}
        key={id}
        label={label}
        history={history}
        outerContainer={outerContainer}
        showModal={showModal}
        showModalToggle={showModalToggle}
        reorderingAllowed={reorderingAllowed}
        updateBookComponentContent={updateBookComponentContent}
        updateBookComponentOrder={updateBookComponentOrder}
        updateBookComponentPagination={updateBookComponentPagination}
        updateBookComponentUploading={updateBookComponentUploading}
        updateBookComponentWorkflowState={updateBookComponentWorkflowState}
        uploadStatus={uploading}
      />
    )
  }
  return (
    <DivisionsContainer>
      {map(divisions, division => {
        const { bookComponents, label, id } = division
        return (
          // <Authorize
          //   object={bookId}
          //   operation="can reorder bookComponents"
          //   unauthorized={this.renderDivision(false, bookComponents, label, id)}
          // >
          renderDivision(true, bookComponents, label, id)
          // </Authorize>
        )
      })}
    </DivisionsContainer>
  )
}

export default DivisionsArea
