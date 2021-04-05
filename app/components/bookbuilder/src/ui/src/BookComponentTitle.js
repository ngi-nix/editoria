import React from 'react'
import { find, indexOf } from 'lodash'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import withLink from '../../../../common/src/withLink'

const Container = styled.div`
  padding: 0;
  padding-top: 3px;
  /* margin-right: ${th('gridUnit')}; */
  flex-basis: ${({ lock, componentType }) =>
    lock && componentType !== 'part' ? '83%' : '88%'};
  overflow-x: hidden;
  overflow-y: hidden;
`
const Title = styled.span`
  background-color: white;
  padding-right: ${th('gridUnit')};
  font-family: 'Vollkorn';
  word-wrap: break-word;
  overflow-y: hidden;
  font-size: ${th('fontSizeHeading3')};
  line-height: 35px;
  &:before {
    counter-increment: ${({ showNumber, componentType }) =>
      showNumber ? componentType : ''};
    content: ${({ showNumber, componentType }) =>
      showNumber ? `counter(${componentType})". "` : ''};
  }
  &:after {
    float: left;
    padding-top: 3px;
    font-size: ${th('fontSizeBaseSmall')};
    width: 0;
    white-space: nowrap;
    content: '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . ';
  }
  a {
    text-decoration: none !important;
    color: ${th('colorText')} !important;
    &:hover {
      color: ${th('colorText')} !important;
    }
  }
`

const BookComponentTitle = ({
  bookComponentId,
  bookId,
  applicationParameter,
  uploading,
  lock,
  history,
  divisionType,
  componentType,
  title,
}) => {
  const { config: divisions } = find(applicationParameter, {
    context: 'bookBuilder',
    area: 'divisions',
  })

  const { showNumberBeforeComponents } = find(divisions, ['name', divisionType])

  const showNumber =
    indexOf(showNumberBeforeComponents, componentType) > -1 || false

  let bookComponentTitle = (
    <Title componentType={componentType} showNumber={showNumber}>
      {title || 'Untitled'}
    </Title>
  )
  const url = `/books/${bookId}/bookComponents/${bookComponentId}`
  if (
    (lock === null || lock === undefined) &&
    !uploading &&
    componentType !== 'toc' &&
    componentType !== 'endnotes'
  ) {
    bookComponentTitle = (
      <Title componentType={componentType} showNumber={showNumber}>
        {withLink(title || 'Untitled', url)}
      </Title>
    )
  }

  return (
    <Container componentType={componentType} lock={lock}>
      {bookComponentTitle}
    </Container>
  )
}

export default BookComponentTitle
