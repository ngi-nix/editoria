import React from 'react'
import { Subscription } from '@apollo/react-components'
import gql from 'graphql-tag'

const BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentOrderUpdated {
    bookComponentOrderUpdated {
      id
    }
  }
`

const BOOK_COMPONENT_UPLOADING_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentUploadingUpdated {
    bookComponentUploadingUpdated {
      id
    }
  }
`

const RUNNING_HEADERS_UPDATED_SUBSCRIPTION = gql`
  subscription RunningHeadersUpdated {
    bookRunningHeadersUpdated {
      id
    }
  }
`

const BOOK_COMPONENT_ADDED_SUBSCRIPTION = gql`
  subscription BookComponentAdded {
    bookComponentAdded {
      id
    }
  }
`
const BOOK_COMPONENT_DELETED_SUBSCRIPTION = gql`
  subscription BookComponentDeleted {
    bookComponentDeleted {
      id
    }
  }
`

const BOOK_COMPONENT_PAGINATION_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentPaginationUpdated {
    bookComponentPaginationUpdated {
      id
    }
  }
`
const BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentWorkflowUpdated {
    bookComponentWorkflowUpdated {
      id
    }
  }
`

const BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentLockUpdated {
    bookComponentLockUpdated {
      id
    }
  }
`
const BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentTitleUpdated {
    bookComponentTitleUpdated {
      id
    }
  }
`
const TEAM_MEMBERS_UPDATED_SUBSCRIPTION = gql`
  subscription TeamMembersUpdated {
    teamMembersUpdated {
      bookId
    }
  }
`
const METADATA_UPDATED_SUBSCRIPTION = gql`
  subscription BookMetadataUpdated {
    bookMetadataUpdated {
      id
    }
  }
`
const bookMetadataSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull

  const triggerRefetch = () => {
    if (pauseUpdates) return
    getBookQuery.refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={METADATA_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const addTeamMemberSubscription = props => {
  const { render, getBookBuilderRulesQuery, statefull } = props
  const { pauseUpdates } = statefull

  const triggerRefetch = () => {
    if (pauseUpdates) return
    getBookBuilderRulesQuery.refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEAM_MEMBERS_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const PRODUCTION_EDITORS_UPDATED_SUBSCRIPTION = gql`
  subscription ProductionEditorsUpdated {
    productionEditorsUpdated {
      bookId
    }
  }
`
const orderChangeSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { refetch } = getBookQuery
  const { pauseUpdates } = statefull
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const COMPONENT_TYPE_UPDATED_SUBSCRIPTION = gql`
  subscription ComponentTypeUpdated {
    bookComponentTypeUpdated {
      id
    }
  }
`
const INCLUDE_IN_TOC_UPDATED_SUBSCRIPTION = gql`
  subscription IncludeInTOCUpdated {
    bookComponentTOCToggled {
      id
    }
  }
`
const componentTypeChangeSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={COMPONENT_TYPE_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const bookComponentIncludeInTOCSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={INCLUDE_IN_TOC_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const bookComponentAddedSubscription = props => {
  const { render, getBookQuery, getBookBuilderRulesQuery, statefull } = props
  const { pauseUpdates } = statefull
  const triggerRefetch = () => {
    if (pauseUpdates) return
    getBookQuery.refetch()
    getBookBuilderRulesQuery.refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_ADDED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const bookComponentDeletedSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_DELETED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const paginationChangeSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_PAGINATION_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const workflowChangeSubscription = props => {
  const { render, getBookQuery, getBookBuilderRulesQuery, statefull } = props
  const { pauseUpdates } = statefull
  const triggerRefetch = () => {
    if (pauseUpdates) return
    getBookBuilderRulesQuery.refetch()
    getBookQuery.refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const lockChangeSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  // if (!getBookQuery.data) {
  //   return null
  // }
  // const { divisions } = getBookQuery.data.getBook
  // const subscribeToBookComponents = []
  // divisions.forEach(division => {
  //   division.bookComponents.forEach(item => {
  //     subscribeToBookComponents.push(item.id)
  //   })
  // })

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION}
      // variables={{ bookComponentIds: subscribeToBookComponents }}
    >
      {render}
    </Subscription>
  )
}
const titleChangeSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const teamMembersChangeSubscription = props => {
  const { render, getBookTeamsQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookTeamsQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEAM_MEMBERS_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const productionEditorChangeSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={PRODUCTION_EDITORS_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const BOOK_RENAMED_SUBSCRIPTION = gql`
  subscription BookRenamed {
    bookRenamed {
      id
      title
      collectionId
    }
  }
`
const bookRenamedSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_RENAMED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

// const docxToHTMLJobSubscription = props => {
//   const { render, ingestWordFilesMutation } = props

//   const { id } = (
//     ((ingestWordFilesMutation || {}).ingestWordFilesResult || {}).data || {}
//   ).createDocxToHTMLJob || { id: false }

//   if (!id) return render()

//   const triggerRefetch = data => {
//     console.log(data)
//   }

//   return (
//     <Subscription
//       onSubscriptionData={triggerRefetch}
//       subscription={DOCX_TO_HTML_JOB}
//       variables={{ jobId: id }}
//     >
//       {render}
//     </Subscription>
//   )
// }

const runningHeadersUpdatedSubscription = props => {
  const { render, getBookQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={RUNNING_HEADERS_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const uploadingUpdatedSubscription = props => {
  // const { render, getBookQuery, statefull } = props
  const { render, getBookQuery, getBookBuilderRulesQuery, statefull } = props
  const { pauseUpdates } = statefull
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    if (pauseUpdates) return
    getBookBuilderRulesQuery.refetch()
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_UPLOADING_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export {
  orderChangeSubscription,
  bookComponentAddedSubscription,
  bookComponentDeletedSubscription,
  paginationChangeSubscription,
  workflowChangeSubscription,
  lockChangeSubscription,
  titleChangeSubscription,
  teamMembersChangeSubscription,
  productionEditorChangeSubscription,
  bookRenamedSubscription,
  componentTypeChangeSubscription,
  addTeamMemberSubscription,
  bookMetadataSubscription,
  // docxToHTMLJobSubscription,
  bookComponentIncludeInTOCSubscription,
  runningHeadersUpdatedSubscription,
  uploadingUpdatedSubscription,
}
