import React, { Fragment } from 'react'
import { th, grid } from '@pubsweet/ui-toolkit'
import styled, { css } from 'styled-components'
import { NavBarLink, Icons } from '../../../ui'

const StyledNavLinks = styled(NavBarLink)`
  width: 100%;
  display: flex;
  align-items: center;
  ${props => props.position === 'center' && center};
  ${props => props.position === 'left' && left};
  ${props => props.position === 'right' && right};
  &:hover {
    svg {
      fill: ${th('colorPrimary')};
      transition: all 0.1s ease-in;
    }
  }
`
const Text = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  overflow: hidden;
  width: 100%;
`
const center = css`
  justify-content: center;
`
const left = css`
  justify-content: flex-start;
`
const right = css`
  justify-content: flex-end;
`
const Container = styled.div`
  display: flex;
  align-items: center;
  width: 32%;
`
const Icon = styled.span`
  margin: 0 4px;
  > svg {
    display: block;
  }
`
const { previousIcon, nextIcon } = Icons

const Header = styled.div`
  display: flex;
  padding: ${grid(1)};
  height: ${grid(9)};
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  > div:not(:last-child) {
    margin-right: ${grid(1)};
  }
`

const createUrl = bookComponent =>
  `/books/${bookComponent.bookId}/bookComponents/${bookComponent.id}`

const WaxHeader = ({ bookComponent }) => {
  const { nextBookComponent, prevBookComponent } = bookComponent
  return (
    <Header>
      <Container>
        {prevBookComponent && (
          <Fragment>
            <StyledNavLinks position="left" to={createUrl(prevBookComponent)}>
              <Icon>{previousIcon}</Icon>
              <Text>{`${prevBookComponent.title || 'Untitled'}`}</Text>
            </StyledNavLinks>
          </Fragment>
        )}
      </Container>
      <Container>
        <StyledNavLinks
          position="center"
          to={`/books/${bookComponent.bookId}/book-builder`}
        >
          <Text>{`${bookComponent.bookTitle} - ${bookComponent.title ||
            'Untitled'}`}</Text>
        </StyledNavLinks>
      </Container>

      <Container>
        {nextBookComponent && (
          <Fragment>
            <StyledNavLinks position="right" to={createUrl(nextBookComponent)}>
              <Text>{`${nextBookComponent.title || 'Untitled'}`}</Text>
              <Icon>{nextIcon}</Icon>
            </StyledNavLinks>
          </Fragment>
        )}
      </Container>
    </Header>
  )
}

export default WaxHeader
