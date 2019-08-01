import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width:50%;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 20px;
`

const randomColor = () => {
  const value = ((Math.random() * 0xffffff) << 0).toString(16)
  return `#${value}`
}
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
const PlaceholderContainer = styled.div`
  height: 100%;
  width: 188px;
  svg {
    #color {
      fill: ${({ color }) => color};
    }
  }
`

const thumbnailPlaceholder = (
  <svg
    width="188"
    height="282 "
    viewBox="0 0 188 282"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect id="back" width="188" height="266" fill="url(#pattern0)" />
    <rect id="color" width="188" height="282" fill="black" fillOpacity="0.3" />
    <defs>
      <pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use transform="translate(-0.635627 -0.594882) scale(0.00182688 0.00129118)" />
      </pattern>
      <image id="image0" width="3902" height="2195" />
    </defs>
  </svg>
)

const Overlay = styled.div`
  background: transparent;
  z-index: 2;

  /* transition: 0.5s ease; */
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

const Image = styled.img`
  height: 100%;
  width: 188px;
`

const Container = styled.div`
  align-items: flex-start;
  justify-content: flex-start;
  position: relative;
  display: flex;
  flex-basis: 33%;
  height: 282px;
  /* min-width:390px; */
  margin-bottom: calc(3 * ${th('gridUnit')});
  &:hover {
    transition: 0.5s ease;

    color: white;
    background: #0964cc;
    ${Overlay} {
      opacity: 1;
    }
    ${Image} {
      background: #0964cc;
      opacity: 0.4;
    }
  }
`
const ImageContainer = styled.div`
  height: 100%;
  margin-right: calc(3 * ${th('gridUnit')});
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
    name,
    thumbnail,
    trimSize,
    onDeleteTemplate,
    onUpdateTemplate,
  } = props
  return (
    <Container>
      <ImageContainer>
        {thumbnail ? (
          <Image src={thumbnail.source} />
        ) : (
          <PlaceholderContainer key={id} color={randomColor()}>
            {thumbnailPlaceholder}
          </PlaceholderContainer>
        )}
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
      </InfoContainer>
      <Overlay>
        <ButtonsContainer>
          <StyledButton
            onClick={() => {
              onUpdateTemplate(id)
            }}
          >
            Update
          </StyledButton>
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
