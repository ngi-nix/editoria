import React from 'react'
import { find, indexOf } from 'lodash'
import config from 'config'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import withLink from 'editoria-common/src/withLink'

const Container = styled.div`
  padding: 0;
  margin-right: ${th('gridUnit')};
  flex-grow:1;
  overflow-x: hidden;
  overflow-y: hidden;
`
const Title = styled.span`
  background-color: white;
  padding-right: ${th('gridUnit')};
  font-family: 'Vollkorn';
  word-wrap: break-word;
  overflow-y: hidden;
  font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')};
  &:before {
    counter-increment: ${({ showNumber, componentType }) =>
      showNumber ? componentType : ''};
    content: ${({ showNumber, componentType }) =>
      showNumber ? `counter(${componentType})". "` : ''};
  }
  &:after {
    float: left;
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
  uploading,
  lock,
  history,
  divisionType,
  componentType,
  title,
}) => {
  // const goToEditor = () => {
  //   if (lock !== null || lock !== undefined || uploading) return

  //   history.push(`/books/${bookId}/bookComponents/${bookComponentId}`)
  // }

  const { divisions } = config.bookBuilder
  // const { componentType } = bookComponent
  const { showNumberBeforeComponents } = find(divisions, ['name', divisionType])

  // console.log('loock', lock)
  const showNumber =
    indexOf(showNumberBeforeComponents, componentType) > -1 || false

  let bookComponentTitle = (
    <Title showNumber={showNumber} componentType={componentType}>
      {title}
    </Title>
  )
  const url = `/books/${bookId}/bookComponents/${bookComponentId}`
  if ((lock === null || lock === undefined) && !uploading) {
    // const children = <Title onDoubleClick={goToEditor}>{title}</Title>
    bookComponentTitle = (
      <Title showNumber={showNumber} componentType={componentType}>
        {withLink(title, url)}
      </Title>
    )
  }

  return <Container>{bookComponentTitle}</Container>
}

export default BookComponentTitle
