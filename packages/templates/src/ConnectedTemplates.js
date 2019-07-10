import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import withModal from 'editoria-common/src/withModal'
import Templates from './Templates'
import { getTemplatesQuery, createTemplateMutation } from './queries'

const mapper = {
  withModal,
  getTemplatesQuery,
  createTemplateMutation,
}

const mapProps = args => {
  return {
    templates: get(args.getTemplatesQuery, 'data.getTemplates'),
    createTemplate: args.createTemplateMutation.createTemplate,
    showModal: args.withModal.showModal,
    hideModal: args.withModal.hideModal,
    loading: args.getTemplatesQuery.networkStatus === 1,
    onChangeSort: args.getTemplatesQuery.refetch,
    refetching:
      args.getTemplatesQuery.networkStatus === 4 ||
      args.getTemplatesQuery.networkStatus === 2, // possible apollo bug
  }
}

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({ templates, createTemplate, onChangeSort, refetching, loading }) => {
      return (
        <Templates
          templates={templates}
          createTemplate={createTemplate}
          onChangeSort={onChangeSort}
          refetching={refetching}
          loading={loading}
        />
      )
    }}
  </Composed>
)

export default Connected
