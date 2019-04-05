import React from 'react'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentOrderUpdated {
    bookComponentOrderUpdated {
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

const bookComponentWorkflowUpdated = props => {
  const { render, getBookBuilderRulesQuery } = props

  const triggerRefetch = () => {
    getBookBuilderRulesQuery.refetch()
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

const addTeamMemberSubscription = props => {
  const { render, getBookBuilderRulesQuery, getDashboardRulesQuery } = props

  const triggerRefetch = () => {
    // getBookBuilderRulesQuery.refetch()
    // if (getDashboardRulesQuery) {
    //   getDashboardRulesQuery.refetch()
    // }
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
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
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

const componentTypeChangeSubscription = props => {
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
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

const bookComponentAddedSubscription = props => {
  const { render, getBookQuery, getBookBuilderRulesQuery } = props
  const triggerRefetch = () => {
    console.log("refetch builder")
    getBookQuery.refetch()
    // getBookBuilderRulesQuery.refetch()
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
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
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
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
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
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    refetch()
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
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const titleChangeSubscription = props => {
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
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
  const { render, getBookTeamsQuery } = props
  const { refetch } = getBookTeamsQuery
  const triggerRefetch = () => {
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
  const { render, getBookQuery } = props
  const { refetch } = getBookQuery
  const triggerRefetch = () => {
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
  componentTypeChangeSubscription,
  addTeamMemberSubscription,
  bookComponentWorkflowUpdated,
}
