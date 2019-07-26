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
      onDeleteTemplate,
      onChangeSort,
      createTemplate,
      refetching,
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
            <TemplatesGrid templates={templates} onDeleteTemplate={onDeleteTemplate} />
            {/* <TemplateList
                templates={templates}
                // bookRules={rules.bookRules}
                // refetching={refetching}
                // onDeleteBook={onDeleteBook}
                // onArchiveBook={onArchiveBook}
                // remove={deleteBook}
                // renameBook={renameBook}
                // archiveBook={archiveBook}
              /> */}
            {/* <UploadFilesButton createTemplate={createTemplate} /> */}
          </InnerWrapper>
        </Fragment>
      </Container>
    )
  }
}

export default Template
