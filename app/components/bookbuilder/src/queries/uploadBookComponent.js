import React from 'react'
import { Mutation } from '@apollo/react-components'
import gql from 'graphql-tag'

const UPLOAD_BOOK_COMPONENT = gql`
  mutation CreateDocxToHTMLJob($file: Upload!) {
    createDocxToHTMLJob(file: $file) {
      status
      id
    }
  }
`

const uploadBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPLOAD_BOOK_COMPONENT}>
      {(uploadBookComponent, uploadBookComponentResult) =>
        render({
          uploadBookComponent,
          uploadBookComponentResult,
        })
      }
    </Mutation>
  )
}

export default uploadBookComponentMutation
