import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import AlignmentBox from './AlignmentBox'

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`
const Label = styled.span`
  color: #828282;
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  font-style: italic;
  margin: ${({ labelPositionRight }) =>
    labelPositionRight ? '0 0 0 10px' : '0 10px 0 0'};
  order: ${({ labelPositionRight }) => (labelPositionRight ? 2 : 0)};
`
const AlignmentBoxWithLabel = ({
  active,
  id,
  labelPositionRight,
  labelText,
  noBorder,
  onClick,
}) => {
  return (
    <Container>
      <Label labelPositionRight={labelPositionRight}>{labelText}</Label>
      <AlignmentBox
        active={active}
        id={id}
        noBorder={noBorder}
        onClick={onClick}
      />
    </Container>
  )
}

export default AlignmentBoxWithLabel
