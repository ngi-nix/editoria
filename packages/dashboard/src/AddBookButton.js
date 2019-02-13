import React from 'react'
import styled from 'styled-components'

import addIcon from './images/icon_add.svg'

const AddBookButtonWrapper = styled.div`
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  margin-left: 24px;
`

const AddBookButtonIcon = styled.div`
  background-color: #666;
  height: 24px;
  margin-right: 4px;
  mask: url(${addIcon}) no-repeat 100% 100%;
  mask-size: cover;
  width: 24px;
`

const AddBookButtonText = styled.div`
  font-family: 'Fira Sans Condensed';
  color: #666;
  text-transform: uppercase;
`

const AddBookButton = ({ onClick }) => (
  <AddBookButtonWrapper onClick={onClick}>
    <AddBookButtonIcon />
    <AddBookButtonText>Add Book</AddBookButtonText>
  </AddBookButtonWrapper>
)

export default AddBookButton
