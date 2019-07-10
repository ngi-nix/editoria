import React, { Component } from 'react'
import styled from 'styled-components'

import { UploadFilesButton } from './ui'

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
      createTemplate,
      onChangeSort,
      refetching,
      loading,
    } = this.props

    if (loading) return 'Loading...'

    return (
      <Container>
        <h1>Hello templates</h1>
        <UploadFilesButton createTemplate={createTemplate} />
      </Container>
    )
  }
}

export default Template
