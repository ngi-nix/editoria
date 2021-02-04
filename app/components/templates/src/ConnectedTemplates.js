import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import withModal from '../../common/src/withModal'
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

const mapProps = args => ({
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
      notes,
      trimSize,
    }) => {
      createTemplate({
        variables: {
          input: {
            files,
            name,
            author,
            notes,
            target,
            trimSize,
            thumbnail,
          },
        },
      })
      hideModal()
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
      notes,
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
            notes,
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
})

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
    }) => (
      <Templates
        createTemplate={createTemplate}
        loading={loading}
        onChangeSort={onChangeSort}
        onCreateTemplate={onCreateTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onUpdateTemplate={onUpdateTemplate}
        refetching={refetching}
        templates={templates}
      />
    )}
  </Composed>
)

export default Connected
