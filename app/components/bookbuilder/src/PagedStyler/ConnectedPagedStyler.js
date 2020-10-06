/* eslint-disable no-console */

import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import { withRouter } from 'react-router-dom'
import {
  getTemplateQuery,
  cloneTemplateMutation,
} from '../../../templates/src/queries'

import withModal from '../../../common/src/withModal'
import PagedStyler from './PagedStyler'
import statefull from '../Statefull'
import {
  updateTemplateCSSFileMutation,
  getBookQuery,
  templateUpdatedForPagedStyledSubscription,
} from '../queries'

const mapper = {
  statefull,
  withModal,
  getTemplateQuery,
  getBookQuery,
  cloneTemplateMutation,
  updateTemplateCSSFileMutation,
  templateUpdatedForPagedStyledSubscription,
}

const mapProps = args => ({
  state: args.statefull.state,
  setState: args.statefull.setState,
  template: get(args.getTemplateQuery, 'data.getTemplate'),
  book: get(args.getBookQuery, 'data.getBook'),
  cloneTemplate: args.cloneTemplateMutation.cloneTemplate,
  updateTemplateCSSFile:
    args.updateTemplateCSSFileMutation.updateTemplateCSSFile,
  loadingBook: args.getBookQuery.networkStatus === 1,
  loading: args.getTemplateQuery.networkStatus === 1,
  refetching:
    args.getTemplateQuery.networkStatus === 4 ||
    args.getTemplateQuery.networkStatus === 2, // possible apollo bug
  onWarningModal: (
    bookId,
    bookTitle,
    file,
    cssFile,
    template,
    hashed,
    history,
  ) => {
    const {
      cloneTemplateMutation,
      updateTemplateCSSFileMutation,
      withModal,
    } = args
    const { cloneTemplate } = cloneTemplateMutation
    const { updateTemplateCSSFile } = updateTemplateCSSFileMutation
    const { showModal, hideModal } = withModal
    return new Promise((resolve, reject) => {
      const saveCssBook = () => {
        cloneTemplate({
          variables: {
            input: {
              id: template.id,
              bookId,
              name: `${template.name}-${bookTitle}`,
              cssFile,
              hashed,
            },
          },
        }).then(res => {
          const { data } = res
          const { cloneTemplate } = data
          const { path } = cloneTemplate
          history.replace(`/books/${bookId}/pagedPreviewer/paged/${path}`)
          hideModal()
          resolve()
        })
      }

      const saveCssAllBook = () => {
        updateTemplateCSSFile({
          variables: {
            input: {
              id: file.id,
              bookId,
              data: cssFile,
              hashed,
            },
          },
        }).then(res => {
          const { data } = res
          console.log('d', data)
          const { updateTemplateCSSFile } = data
          const { path } = updateTemplateCSSFile
          history.replace(`/books/${bookId}/pagedPreviewer/paged/${path}`)
          hideModal()
          resolve()
        })
      }

      showModal('warningPagedJs', {
        saveCssBook,
        saveCssAllBook,
        name: template.name,
      })
    })
  },
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const {
    match: {
      params: { hashed, templateId, id },
    },
    history,
  } = props
  return (
    <Composed bookId={id} templateId={templateId}>
      {({ book, template, onWarningModal, loading, loadingBook }) => {
        if (loading || loadingBook) return <p>Loading ...</p>
        return (
          <PagedStyler
            bookId={book.id}
            bookTitle={book.title}
            hashed={hashed}
            history={history}
            onWarningModal={onWarningModal}
            template={template}
          />
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
