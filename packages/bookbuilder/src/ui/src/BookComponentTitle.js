import React from 'react'
import { find, indexOf } from 'lodash'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import withLink from 'editoria-common/src/withLink'

const Container = styled.div`
  padding: 0;
  padding-top:3px;
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
  // const goToEditor = () => {
  //   if (lock !== null || lock !== undefined || uploading) return

  //   history.push(`/books/${bookId}/bookComponents/${bookComponentId}`)
  // }

  const { config: divisions } = find(applicationParameter, {
    context: 'bookBuilder',
    area: 'divisions',
  })

  // const { componentType } = bookComponent
  const { showNumberBeforeComponents } = find(divisions, ['name', divisionType])

  // console.log('loock', lock)
  const showNumber =
    indexOf(showNumberBeforeComponents, componentType) > -1 || false

  let bookComponentTitle = (
    <Title showNumber={showNumber} componentType={componentType}>
      {title || 'Untitled'}
    </Title>
  )
  const url = `/books/${bookId}/bookComponents/${bookComponentId}`
  if (
    (lock === null || lock === undefined) &&
    !uploading &&
    componentType !== 'toc'
  ) {
    // const children = <Title onDoubleClick={goToEditor}>{title}</Title>
    bookComponentTitle = (
      <Title showNumber={showNumber} componentType={componentType}>
        {withLink(title || 'Untitled', url)}
      </Title>
    )
  }

  return (
    <Container lock={lock} componentType={componentType}>
      {bookComponentTitle}
    </Container>
  )
}

export default BookComponentTitle
