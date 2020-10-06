import React from 'react'
import { get } from 'lodash'
import { th } from '@pubsweet/ui-toolkit'
import styled from 'styled-components'
import withLink from '../../common/src/withLink'

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

const WithLinkDecoration = styled.div`
  a {
    text-decoration: none;
    color: black;
    :hover {
      border-bottom: 1px solid black;
    }
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  > div {
    text-align: center;
    width: 30%;
  }
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
      <BookTitle data-testid="current-component">{`${
        bookComponent.bookTitle
      } - Chapter ${chapterNumber}. ${bookComponent.title ||
        'Untitled'}`}</BookTitle>
    )
  } else {
    header = (
      <BookTitle data-testid="current-component">{`${
        bookComponent.bookTitle
      } - ${bookComponent.title || 'Untitled'}`}</BookTitle>
    )
  }
  const { nextBookComponent, prevBookComponent } = bookComponent
  return (
    <Header>
      <div>
        {prevBookComponent && (
          <WithLinkDecoration data-testid="previous-component">
            {withLink(
              `${prevBookComponent.title || 'Untitled'}`,
              createUrl(prevBookComponent),
            )}
          </WithLinkDecoration>
        )}
      </div>
      {header}
      <div>
        {nextBookComponent && (
          <WithLinkDecoration data-testid="next-component">
            {withLink(
              `${nextBookComponent.title || 'Untitled'}`,
              createUrl(nextBookComponent),
            )}
          </WithLinkDecoration>
        )}
      </div>
    </Header>
  )
}

export default WaxHeader
