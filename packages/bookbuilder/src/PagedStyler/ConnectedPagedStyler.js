/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import {
  getTemplateQuery,
  cloneTemplateMutation,
} from 'pubsweet-component-editoria-templates/src/queries'

import withModal from 'editoria-common/src/withModal'
import PagedStyler from './PagedStyler'
import statefull from '../Statefull'
import { updateFileMutation, getBookQuery } from '../queries'

const mapper = {
  statefull,
  withModal,
  getTemplateQuery,
  getBookQuery,
  cloneTemplateMutation,
  updateFileMutation,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  template: get(args.getTemplateQuery, 'data.getTemplate'),
  book: get(args.getBookQuery, 'data.getBook'),
  loadingBook: args.getBookQuery.networkStatus === 1,
  loading: args.getTemplateQuery.networkStatus === 1,
  refetching:
    args.getTemplateQuery.networkStatus === 4 ||
    args.getTemplateQuery.networkStatus === 2, // possible apollo bug
  onWarningModal: (file, cssFile, template, hashed) =>
    new Promise((resolve, reject) => {
      const {
        withModal,
        cloneTemplateMutation: { cloneTemplate },
        getTemplateQuery: {
          data: {
            getTemplate: { id, name: templateName },
          },
        },
        getBookQuery: {
          data: {
            getBook: { title: name },
          },
        },
        updateFileMutation: { updateFile },
      } = args
      const { showModal, hideModal } = withModal
      const saveCssBook = () => {
        cloneTemplate({
          variables: {
            input: { id, name: `${templateName}-${name}`, cssFile, hashed },
          },
        }).then(res => resolve())
        hideModal()
      }

      const saveCssAllBook = () => {
        updateFile({
          variables: {
            input: {
              id: file.id,
              data: cssFile,
              hashed,
            },
          },
        }).then(() => resolve())
        hideModal()
      }

      showModal('warningPagedJs', {
        saveCssBook,
        saveCssAllBook,
        name: template.name,
      })
    }),
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const {
    match: {
      params: { hashed, templateId, id },
    },
  } = props

  return (
    <Composed bookId={id} templateId={templateId}>
      {({ template, onWarningModal, loading }) => {
        if (loading) return <p>Loading ...</p>
        return (
          <PagedStyler
            hashed={hashed}
            onWarningModal={onWarningModal}
            template={template}
          />
        )
      }}
    </Composed>
  )
}

export default Connected
