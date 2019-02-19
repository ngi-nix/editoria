import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Container = styled.div`
  border: 1px solid ${th('colorText')};
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 1);
  cursor: pointer;
  height: 26px;
  width: 17px;
  background-color: ${({ active }) =>
    active ? th('colorText') : 'white'};
  &:hover {
    background-color: ${th('colorFurniture')};
  }
  border-top: ${({ noBorder }) => (noBorder.top ? 0 : '')};
  border-right: ${({ noBorder }) => (noBorder.right ? 0 : '')};
  border-bottom: ${({ noBorder }) => (noBorder.bottom ? 0 : '')};
  border-left: ${({ noBorder }) => (noBorder.left ? 0 : '')};
`
const AlignmentBox = ({ active, id, noBorder, onClick }) => {
  console.log('act', active)
  return (
    <Container
      active={active}
      noBorder={noBorder}
      id={id}
      onClick={onClick}
      role="presentation"
    />
  )
}

export default AlignmentBox
