import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { Template } from '../../ui'

const GridContainer = styled.div`
  align-items: center;
  justify-content: space-between;
  flex-wrap:wrap;
  display: flex;
  flex-basis: 100%;
`

const TemplatesGrid = props => {
  const { templates } = props
  return (
    <GridContainer>
      {templates.map(template => {
        const {
          templateName,
          author,
          targetType,
          thumbnailSrc,
          files,
          trimSize,
        } = template
        return (
          <Template
            author={author}
            files={files}
            targetType={targetType}
            templateName={templateName}
            thumbnailSrc={thumbnailSrc}
            trimSize={trimSize}
          />
        )
      })}
    </GridContainer>
  )
}

export default TemplatesGrid
