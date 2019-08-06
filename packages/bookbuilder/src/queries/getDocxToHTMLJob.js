import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const GET_DOCX_TO_HTML_JOB = gql`
  query docxToHTMLJob($jobId: String!) {
    docxToHTMLJob(jobId: $jobId) {
      status
      html
    }
  }
`

const getDocxToHTMLJobQuery = props => {
  const {
    render,
    docxToHTMLJobSubscription,
    uploadBookComponentMutation,
  } = props

  const { status } = ((docxToHTMLJobSubscription || {}).data || {})
    .docxToHTMLJob || { status: '' }

  console.log(status !== 'Conversion complete')

  if (status !== 'Conversion complete') return render()

  const {
    uploadBookComponentResult: {
      data: {
        createDocxToHTMLJob: { id: jobId },
      },
    },
  } = uploadBookComponentMutation

  return (
    <Query
      fetchPolicy="cache-and-network"
      notifyOnNetworkStatusChange
      query={GET_DOCX_TO_HTML_JOB}
      variables={{ jobId }}
    >
      {render}
    </Query>
  )
}

export { GET_DOCX_TO_HTML_JOB }
export default getDocxToHTMLJobQuery
