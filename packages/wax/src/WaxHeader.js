import React from 'react'
import { get } from 'lodash'
import { th } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'
import withLink from 'editoria-common/src/withLink'

const BookTitle = styled.div`
  padding-left: calc(3.5 * ${th('gridUnit')});
  color: ${th('colorText')};
  /* text-align:center;  */
  align-items: center;
  margin-bottom: calc(2 * ${th('gridUnit')});
  font-size: ${th('fontSizeHeading5')};
  line-height: ${th('lineHeightHeading5')};
  font-family: 'Vollkorn';
`

const Header = styled.div`
  display: flex;
  justify-content: space-around;
`

const createUrl = bookComponent =>
  `/books/${bookComponent.bookId}/bookComponents/${bookComponent.id}`

const WaxHeader = ({ bookComponent }) => {
  let chapterNumber
  if (get(bookComponent, 'componentType') === 'chapter') {
    chapterNumber = get(bookComponent, 'componentTypeOrder')
  }
  let header
  if (chapterNumber) {
    header = (
      <BookTitle>{`${bookComponent.bookTitle} - Chapter ${chapterNumber}. ${
        bookComponent.title
      }`}</BookTitle>
    )
  } else {
    header = (
      <BookTitle>{`${bookComponent.bookTitle} - ${
        bookComponent.title
      }`}</BookTitle>
    )
  }
  const { nextBookComponent, prevBookComponent } = bookComponent
  return (
    <Header>
      <div>
        {prevBookComponent &&
          withLink(prevBookComponent.title, createUrl(prevBookComponent))}
      </div>
      {header}
      <div>
        {nextBookComponent &&
          withLink(nextBookComponent.title, createUrl(nextBookComponent))}
      </div>
    </Header>
  )
}

export default WaxHeader
