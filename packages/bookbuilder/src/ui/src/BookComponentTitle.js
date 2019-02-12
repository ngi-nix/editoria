import React, { Component } from 'react'
import config from 'config'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Container = styled.div`
  padding: 0;
  line-height: ${th('lineHeightHeading3')};
  margin-right: ${th('gridUnit')};
  flex-grow: 1;
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
      '. . . . . . . . . . . . . . . . . . . . ';
  }
`

const BookComponentTitle = props => {
  return (
    <Container>
      <Title>This is the begining of a new sdfgsdf sdfgsdfgs sdfgsdfg sdfgsdfg sdfgsdfg sertertg sdfgsdfgsdfg dfsgsdfgc title which is title which is title which istitle which is title which is title which istitle which istitle which is</Title>
      {/* <Dots /> */}
    </Container>
  )
}

export default BookComponentTitle
