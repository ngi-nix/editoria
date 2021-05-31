import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'

import withModal from '../../common/src/withModal'
import Templates from './Templates'
import {
  getTemplatesQuery,
  getExportScriptsQuery,
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
  getExportScriptsQuery,
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
    const { createTemplateMutation, withModal, getExportScriptsQuery } = args
    const { data, loading } = getExportScriptsQuery
    const { getExportScripts } = data
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
      exportScripts,
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
            exportScripts,
          },
        },
      })
      hideModal()
    }
    if (!loading) {
      const options = getExportScripts.map(script => ({
        label: script.label,
        value: script.value,
      }))
      showModal('createTemplateModal', {
        onConfirm,
        hideModal,
        headerText: 'Create New Template',
        mode: 'create',
        scriptOptions: options,
      })
    }
  },
  onUpdateTemplate: templateId => {
    const { updateTemplateMutation, withModal, getExportScriptsQuery } = args
    const { data, loading } = getExportScriptsQuery
    const { getExportScripts } = data
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
      exportScripts,
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
            exportScripts,
          },
        },
      }).then(() => {
        hideModal()
      })
    }
    if (!loading) {
      const options = getExportScripts.map(script => ({
        label: script.label,
        value: script.value,
      }))
      showModal('updateTemplateModal', {
        onConfirm,
        hideModal,
        mode: 'update',
        templateId,
        headerText: 'Update Template',
        scriptOptions: options,
      })
    }
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
