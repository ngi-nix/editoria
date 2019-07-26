import React from 'react'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const TEMPLATE_CREATED_SUBSCRIPTION = gql`
  subscription TemplateCreated {
    templateCreated {
      id
    }
  }
`
const TEMPLATE_UPDATED_SUBSCRIPTION = gql`
  subscription TemplateUpdated {
    templateUpdated {
      id
    }
  }
`

const TEMPLATE_DELETED_SUBSCRIPTION = gql`
  subscription TemplateDeleted {
    templateDeleted {
      id
    }
  }
`
const templateCreatedSubscription = props => {
  const { render, getTemplatesQuery } = props
  const { refetch } = getTemplatesQuery
  const triggerRefetch = () => {
    refetch()
  }
  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEMPLATE_CREATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}
const templateUpdatedSubscription = props => {
  const { render, getTemplatesQuery } = props
  const { refetch } = getTemplatesQuery
  const triggerRefetch = () => {
    refetch()
  }
  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEMPLATE_UPDATED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

const templateDeletedSubscription = props => {
  const { render, getTemplatesQuery } = props
  const { refetch } = getTemplatesQuery
  const triggerRefetch = () => {
    refetch()
  }

  return (
    <Subscription
      onSubscriptionData={triggerRefetch}
      subscription={TEMPLATE_DELETED_SUBSCRIPTION}
    >
      {render}
    </Subscription>
  )
}

export {
  templateCreatedSubscription,
  templateUpdatedSubscription,
  templateDeletedSubscription,
}
