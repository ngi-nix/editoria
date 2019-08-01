import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import withModal from 'editoria-common/src/withModal'
import Templates from './Templates'
import {
  getTemplatesQuery,
  createTemplateMutation,
  updateTemplateMutation,
  deleteTemplateMutation,
  templateCreatedSubscription,
  templateUpdatedSubscription,
  templateDeletedSubscription,
} from './queries'

const mapper = {
  withModal,
  getTemplatesQuery,
  templateCreatedSubscription,
  templateUpdatedSubscription,
  templateDeletedSubscription,
  createTemplateMutation,
  updateTemplateMutation,
  deleteTemplateMutation,
}

const mapProps = args => {
  return {
    templates: get(args.getTemplatesQuery, 'data.getTemplates'),
    createTemplate: args.createTemplateMutation.createTemplate,
    updateTemplate: args.updateTemplateMutation.updateTemplate,
    deleteTemplateMutation: args.deleteTemplateMutation.deleteTemplate,
    showModal: args.withModal.showModal,
    hideModal: args.withModal.hideModal,
    loading: args.getTemplatesQuery.networkStatus === 1,
    onChangeSort: args.getTemplatesQuery.refetch,
    onCreateTemplate: () => {
      const { createTemplateMutation, withModal } = args
      const { createTemplate } = createTemplateMutation
      const { showModal, hideModal } = withModal
      const onConfirm = ({
        files,
        thumbnail,
        name,
        author,
        target,
        trimSize,
      }) => {
        createTemplate({
          variables: {
            input: {
              files,
              name,
              author,
              target,
              trimSize,
              thumbnail,
            },
          },
        }).then(() => {
          hideModal()
        })
      }

      showModal('createTemplateModal', {
        onConfirm,
        hideModal,
        headerText: 'Create New Template',
        mode: 'create',
      })
    },
    onUpdateTemplate: templateId => {
      const { updateTemplateMutation, withModal } = args
      const { updateTemplate } = updateTemplateMutation
      const { showModal, hideModal } = withModal
      const onConfirm = ({
        files,
        deleteFiles,
        thumbnail,
        deleteThumbnail,
        name,
        author,
        target,
        trimSize,
      }) => {
        updateTemplate({
          variables: {
            input: {
              id: templateId,
              files,
              deleteThumbnail,
              deleteFiles,
              name,
              author,
              target,
              trimSize,
              thumbnail,
            },
          },
        }).then(() => {
          hideModal()
        })
      }
      showModal('updateTemplateModal', {
        onConfirm,
        hideModal,
        mode: 'update',
        templateId,
        headerText: 'Update Template',
      })
    },
    onDeleteTemplate: (templateId, templateName) => {
      const { deleteTemplateMutation, withModal } = args
      const { deleteTemplate } = deleteTemplateMutation
      const { showModal, hideModal } = withModal
      const onConfirm = () => {
        deleteTemplate({
          variables: {
            id: templateId,
          },
        })
        hideModal()
      }
      showModal('deleteTemplateModal', {
        onConfirm,
        templateName,
      })
    },
    refetching:
      args.getTemplatesQuery.networkStatus === 4 ||
      args.getTemplatesQuery.networkStatus === 2, // possible apollo bug
  }
}

const Composed = adopt(mapper, mapProps)

const Connected = () => (
  <Composed>
    {({
      templates,
      onCreateTemplate,
      onUpdateTemplate,
      onDeleteTemplate,
      onChangeSort,
      refetching,
      loading,
      createTemplate,
    }) => {
      return (
        <Templates
          templates={templates}
          onCreateTemplate={onCreateTemplate}
          onUpdateTemplate={onUpdateTemplate}
          onDeleteTemplate={onDeleteTemplate}
          onChangeSort={onChangeSort}
          refetching={refetching}
          createTemplate={createTemplate}
          loading={loading}
        />
      )
    }}
  </Composed>
)

export default Connected
