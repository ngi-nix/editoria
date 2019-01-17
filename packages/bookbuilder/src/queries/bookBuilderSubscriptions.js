import gql from 'graphql-tag'

const BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentOrderUpdated {
    bookComponentOrderUpdated {
      id
      divisions {
        id
        label
        bookComponents {
          id
          divisionId
          title
          bookId
          hasContent
          componentTypeOrder
          pagination {
            left
            right
          }
          workflowStages {
            label
            type
            value
          }
          componentType
          uploading
          archived
        }
      }
    }
  }
`
const BOOK_COMPONENT_ADDED_SUBSCRIPTION = gql`
  subscription BookComponentAdded {
    bookComponentAdded {
      id
      divisionId
      title
      bookId
      hasContent
      componentTypeOrder
      pagination {
        left
        right
      }
      workflowStages {
        label
        type
        value
      }
      componentType
      uploading
      archived
    }
  }
`
const BOOK_COMPONENT_DELETED_SUBSCRIPTION = gql`
  subscription BookComponentDeleted {
    bookComponentDeleted {
      id
      divisionId
      title
      bookId
      hasContent
      componentTypeOrder
      pagination {
        left
        right
      }
      workflowStages {
        label
        type
        value
      }
      componentType
      uploading
      archived
    }
  }
`

const BOOK_COMPONENT_PAGINATION_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentPaginationUpdated {
    bookComponentPaginationUpdated {
      id
      divisionId
      title
      bookId
      hasContent
      componentTypeOrder
      pagination {
        left
        right
      }
      workflowStages {
        label
        type
        value
      }
      componentType
      uploading
      archived
    }
  }
`
const BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentWorkflowUpdated {
    bookComponentWorkflowUpdated {
      id
      divisionId
      title
      bookId
      hasContent
      componentTypeOrder
      pagination {
        left
        right
      }
      workflowStages {
        label
        type
        value
      }
      componentType
      uploading
      archived
    }
  }
`

const BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentLockUpdated {
    bookComponentLockUpdated {
      id
      divisions {
        id
        label
        bookComponents {
          id
          divisionId
          title
          bookId
          hasContent
          componentTypeOrder
          pagination {
            left
            right
          }
          workflowStages {
            label
            type
            value
          }
          componentType
          uploading
          archived
        }
      }
    }
  }
`
const BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION = gql`
  subscription BookComponentTitleUpdated {
    bookComponentTitleUpdated {
      title
      bookId
      id
      divisionId
    }
  }
`
const TEAM_MEMBERS_UPDATED_SUBSCRIPTION = gql`
  subscription TeamMembersUpdated {
    teamMembersUpdated {
      bookId
      teamId
      teamType
      members {
        id
        username
        email
        admin
      }
    }
  }
`
const PRODUCTION_EDITORS_UPDATED_SUBSCRIPTION = gql`
  subscription ProductionEditorsUpdated {
    productionEditorsUpdated {
      bookId
      teamId
      teamType
      members {
        username
      }
    }
  }
`

export {
  BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_ADDED_SUBSCRIPTION,
  BOOK_COMPONENT_DELETED_SUBSCRIPTION,
  BOOK_COMPONENT_PAGINATION_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
  TEAM_MEMBERS_UPDATED_SUBSCRIPTION,
  PRODUCTION_EDITORS_UPDATED_SUBSCRIPTION,
}
