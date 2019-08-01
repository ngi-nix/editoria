import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { Template } from '../../ui'

const GridContainer = styled.div`
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  display: flex;
  flex-basis: 100%;
  div:nth-child(3n + 3) {
    margin-right: 0;
  }
`

const TemplatesGrid = props => {
  const { templates, onDeleteTemplate, onUpdateTemplate } = props
  return (
    <GridContainer>
      {templates.map(template => {
        const { name, id, author, target, thumbnail, trimSize } = template
        return (
          <Template
            onDeleteTemplate={onDeleteTemplate}
            onUpdateTemplate={onUpdateTemplate}
            key={id}
            id={id}
            author={author}
            target={target}
            name={name}
            thumbnail={thumbnail}
            trimSize={trimSize}
          />
        )
      })}
    </GridContainer>
  )
}

export default TemplatesGrid
