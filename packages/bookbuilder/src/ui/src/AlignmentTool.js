import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import AlignmentBoxWithLabel from './AlignmentBoxWithLabel'

const Container = styled.div`
  display: flex;
  justify-content: center;
`
const Separator = styled.div`
  background-color: ${th('colorText')};
  height: 40px;
  width: 1px;
`

const AlignmentTool = ({ data, onClickAlignmentBox }) => {
  const onClick = event => {
    const { currentTarget } = event
    const { id } = currentTarget
    onClickAlignmentBox(id)
  }
  const leftData = data.left
  const rightData = data.right

  const noBorderRight = { right: true }
  const noBorderLeft = { left: true }

  return (
    <Container>
      <AlignmentBoxWithLabel
        active={leftData}
        id="left"
        labelText="left"
        noBorder={noBorderRight}
        onClick={onClick}
      />

      <Separator />

      <AlignmentBoxWithLabel
        active={rightData}
        id="right"
        labelPositionRight
        labelText="right"
        noBorder={noBorderLeft}
        onClick={onClick}
      />
    </Container>
  )
}

export default AlignmentTool
