import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const UPLOAD_BOOK_COMPONENT = gql`
  mutation CreateDocxToHTMLJob($file: Upload!, $fileSize: Int) {
    createDocxToHTMLJob(file: $file, fileSize: $fileSize) {
      status
      html
    }
  }
`

const uploadBookComponentMutation = props => {
  const { render } = props

  return (
    <Mutation mutation={UPLOAD_BOOK_COMPONENT}>
      {(uploadBookComponent, uploadBookComponentResult) =>
        render({ uploadBookComponent, uploadBookComponentResult })
      }
    </Mutation>
  )
}

export default uploadBookComponentMutation
