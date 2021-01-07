import React, { Fragment } from 'react'
import styled from 'styled-components'

import { TemplatesHeader, TemplatesGrid } from './ui'

import { Loading } from '../../../ui'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  height: 100%;
  max-width: 100%;
`
const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
  height: calc(100% - 72px);
`
const Template = ({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onChangeSort,
  loading,
}) => {
  if (loading) return <Loading vertical="center" />

  return (
    <Container>
      <Fragment>
        <TemplatesHeader
          canAddTemplates
          onChangeSort={onChangeSort}
          onCreateTemplate={onCreateTemplate}
          title="Templates"
        />
        <InnerWrapper>
          <TemplatesGrid
            onDeleteTemplate={onDeleteTemplate}
            onUpdateTemplate={onUpdateTemplate}
            templates={templates}
          />
        </InnerWrapper>
      </Fragment>
    </Container>
  )
}

export default Template
