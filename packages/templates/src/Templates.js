import React, { Component, Fragment } from 'react'
import styled from 'styled-components'

import { UploadFilesButton, TemplatesHeader, TemplatesGrid } from './ui'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 100%;
`
const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
`
export class Template extends Component {
  render() {
    const {
      templates,
      onCreateTemplate,
      onUpdateTemplate,
      onDeleteTemplate,
      onChangeSort,
      loading,
    } = this.props

    if (loading) return 'Loading...'

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
}

export default Template
