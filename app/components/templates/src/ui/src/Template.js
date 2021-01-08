import React from 'react'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

import { Button } from '../../../../../ui'

const ButtonsContainer = styled.div`
  display: flex;
  visibility: hidden;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: calc(2 * ${th('gridUnit')});
  > button {
    margin-bottom: ${grid(2)};
  }
`

const StyledButton = styled(Button)`
  background: white;
`

const ImageContainer = styled.div`
  height: 100%;
  width: 188px;
  background-size: contain;
  margin-right: calc(3 * ${th('gridUnit')});
  background-repeat: no-repeat;
  ${({ thumbnail, color }) =>
    thumbnail
      ? `background-image: url(${thumbnail.source})`
      : `background: ${color}`}
`

const Container = styled.div`
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  margin-right: calc(1.5 * ${th('gridUnit')});
  display: flex;
  flex-basis: 32.3%;
  height: 282px;
  margin-bottom: calc(3 * ${th('gridUnit')});
  &:hover {
    ${ButtonsContainer} {
      visibility: visible;
    }
    ${ImageContainer} {
      box-shadow: inset 0 0 0 1000px rgba(9, 100, 204, 0.7);
    }
    background: #0964cc;
    color: white;
  }
`

const InfoContainer = styled.div`
  display: flex;
  padding-top: calc(1 * ${th('gridUnit')});
  flex-direction: column;
  max-width: 140px;
`
const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: calc(2 * ${th('gridUnit')});
`
const Label = styled.div`
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
`
const Text = styled.div`
  font-family: ${th('fontReading')};
  font-size: calc(1.125 * ${th('fontSizeBase')});
  line-height: calc(1.125 * ${th('lineHeightBase')});
  word-wrap: break-word;
`

const Template = props => {
  const {
    author,
    id,
    target,
    notes,
    name,
    thumbnail,
    trimSize,
    onDeleteTemplate,
    onUpdateTemplate,
  } = props
  return (
    <Container>
      <ImageContainer color="#F1F1F1" thumbnail={thumbnail}>
        <ButtonsContainer>
          <StyledButton
            label="Update"
            onClick={() => {
              onUpdateTemplate(id)
            }}
            title="Update"
          />
          <StyledButton
            danger
            label="Delete"
            onClick={() => {
              onDeleteTemplate(id, name)
            }}
            title="Delete"
          />
        </ButtonsContainer>
      </ImageContainer>
      <InfoContainer>
        <Row>
          <Label>name</Label>
          <Text>{name}</Text>
        </Row>
        <Row>
          <Label>author</Label>
          <Text>{author || '-'}</Text>
        </Row>
        <Row>
          <Label>trim size</Label>
          <Text>{trimSize || '-'}</Text>
        </Row>
        <Row>
          <Label>target</Label>
          <Text>{target || '-'}</Text>
        </Row>
        <Row>
          <Label>notes</Label>
          <Text>{notes || '-'}</Text>
        </Row>
      </InfoContainer>
    </Container>
  )
}

export default Template
