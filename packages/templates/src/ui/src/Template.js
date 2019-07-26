import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { DefaultButton } from '../../ui'

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 20px;
`
const StyledButton = styled.button`
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  border: none;
  font-size: 18px;
  color: #828282;
  width: 110px;
  height: 40px;
  display: flex;
  margin-bottom: 10px;
  padding: 0;
  border-bottom: 1px solid ${th('colorBackground')};

  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
  }
  &:not(:disabled):active {
    border: none;
    color: ${th('colorPrimary')};
    outline: none;
    border-bottom: 1px solid ${th('colorPrimary')};
  }
  &:focus {
    outline: 0;
  }
`
const Overlay = styled.div`
  background: transparent;

  /* transition: 0.5s ease; */
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

const Container = styled.div`
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  display: flex;
  flex-basis: 30%;
  min-height: 282px;
  /* min-width:390px; */
  margin-bottom: calc(3 * ${th('gridUnit')});
  &:hover {
    transition: 0.5s ease;

    color: white;
    background: #0964cc;
    /* ${Overlay} {
      opacity: 1;
    } */
  }
`
const Image = styled.div`
  width: 50%;
`

const Info = styled.div`
  width: 50%;
`

const Template = props => {
  const {
    author,
    id,
    files,
    targetType,
    name,
    thumbnailSrc,
    trimSize,
    onDeleteTemplate,
  } = props
  return (
    <Container>
      <Image />
      <Info>{name}</Info>
      <Overlay>
        <ButtonsContainer>
          <StyledButton>Update</StyledButton>
          <StyledButton
            onClick={() => {
              onDeleteTemplate(id, name)
            }}
          >
            Delete
          </StyledButton>
        </ButtonsContainer>
      </Overlay>
    </Container>
  )
}

export default Template
