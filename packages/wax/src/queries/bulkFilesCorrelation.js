import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const BULK_FILES_CORRELATION = gql`
  mutation BulkFilesCorrelation(
    $toCorrelate: [ID]
    $toUnCorrelate: [ID]
    $entityId: ID!
    $entityType: String!
  ) {
    bulkFilesCorrelation(
      toCorrelate: $toCorrelate
      toUnCorrelate: $toUnCorrelate
      entityId: $entityId
      entityType: $entityType
    )
  }
`

const bulkFilesCorrelationMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={BULK_FILES_CORRELATION}>
      {(bulkFilesCorrelation, bulkFilesCorrelationResult) =>
        render({ bulkFilesCorrelation, bulkFilesCorrelationResult })
      }
    </Mutation>
  )
}

export default bulkFilesCorrelationMutation
