import React from 'react'
import { get } from 'lodash'
import { adopt } from 'react-adopt'
import TemplateModal from './TemplateModal'
import { getTemplateQuery } from '../../../queries'

const mapper = {
  getTemplateQuery,
}

const mapProps = args => ({
  template: get(args.getTemplateQuery, 'data.getTemplate'),
  loadingTemplate: args.getTemplateQuery.networkStatus === 1,
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { data, isOpen, hideModal } = props
  const { templateId } = data
  return (
    <Composed templateId={templateId}>
      {({ template, loadingTemplate }) => {
        if (loadingTemplate || !template) return null
        return (
          <TemplateModal
            data={data}
            hideModal={hideModal}
            isOpen={isOpen}
            key={template.id}
            template={template}
          />
        )
      }}
    </Composed>
  )
}

export default Connected
