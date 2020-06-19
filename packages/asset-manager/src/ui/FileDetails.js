import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { dateTimeFormatter, fileSizeFormatter } from './helpers'
import { IconButton, InfoItem } from '../ui'

const PreviewWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-start;
  padding-left: 16px;
  width: 35%;
`

const ClosePreview = styled.div`
  display: flex;
  height: 4.96%;
  justify-content: flex-end;
  width: 100%;
`

const icon = (
  <svg fill="#111" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

const ImagePreviewer = styled.div`
  align-items: center;
  align-self: center;
  display: flex;
  height: 53.79%;
  justify-content: center;
  width: 100%;
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  height: 41.25%;
  overflow-y: auto;
  width: 100%;
`
const InfoHeaderWrapper = styled.div`
  background: white;
  border-bottom: 1px solid black;
  display: flex;
  margin-bottom: 4px;
  position: sticky;
  top: 0;
  width: 100%;
`
const InfoHeader = styled.h2`
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')};
  margin: 0;
  padding: 0;
`

const ItemWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  margin-bottom: 4px;
  width: 100%;
`
const ItemHeader = styled.h5`
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeHeading6')};
  line-height: ${th('lineHeightHeading6')};
  margin: 0;
  padding: 0;
`

const FileDetails = ({ file, updateFile, closeHandler }) => {
  const { alt, source, id, name, size, mimetype, updated, metadata } = file
  return (
    <PreviewWrapper>
      <ClosePreview>
        <IconButton
          icon={icon}
          onClick={e => {
            closeHandler(undefined)
          }}
        />
      </ClosePreview>
      <ImagePreviewer>
        <img alt={alt} src={source} />
      </ImagePreviewer>
      <InfoSection>
        <InfoHeaderWrapper>
          <InfoHeader>Info</InfoHeader>
        </InfoHeaderWrapper>

        <ItemWrapper>
          <ItemHeader>Name</ItemHeader>
          <InfoItem
            editable
            key={`${id}-name`}
            type="name"
            updateFile={updateFile}
            value={name}
          />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Alt</ItemHeader>
          <InfoItem
            editable
            key={`${id}-alt`}
            type="alt"
            updateFile={updateFile}
            value={alt || '-'}
          />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Size</ItemHeader>
          <InfoItem key={`${id}-size`} value={fileSizeFormatter(size)} />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Mimetype</ItemHeader>
          <InfoItem key={`${id}-mimetype`} value={mimetype} />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Updated</ItemHeader>
          <InfoItem key={`${id}-updated`} value={dateTimeFormatter(updated)} />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Dimensions (W x H)</ItemHeader>
          <InfoItem
            key={`${id}-dimensions`}
            value={`${metadata.width} x ${metadata.height}`}
          />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Color space</ItemHeader>
          <InfoItem key={`${id}-colorSpace`} value={metadata.space} />
        </ItemWrapper>
        <ItemWrapper>
          <ItemHeader>Density</ItemHeader>
          <InfoItem key={`${id}-density`} value={metadata.density || '-'} />
        </ItemWrapper>
      </InfoSection>
    </PreviewWrapper>
  )
}

export default FileDetails
