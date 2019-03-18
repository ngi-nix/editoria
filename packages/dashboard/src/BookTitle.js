import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background-image: linear-gradient(
    to right,
    #666 50%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom 12px left 0;
  background-repeat: repeat-x;
  background-size: 6px 1px;
  flex-grow: 1;
`

const Text = styled.span`
  background-color: white;
  color: #404040 !important;
  cursor: ${({ archived }) => (archived ? 'inherit' : 'pointer')};
  font-size: 28px !important;
  font-style: italic;
  font-family: 'Vollkorn' !important;
  line-height: 39px;
  margin: 0 !important;
  word-wrap: break-word;
  user-select: none;
`

const Input = styled.input`
  border: 0;
  border-bottom: 1px dashed black;
  font-family: 'Vollkorn' !important;
  font-style: italic !important;
  line-height: 30px;
  color: #333 !important;
  font-size: 28px !important;
  outline: 0;
  width: 100%;
`

const BookTitle = props => {
  const {
    handleKeyOnInput,
    isRenaming,
    rename,
    title,
    archived,
    ...rest
  } = props
  let input

  if (isRenaming) {
    const handleKey = event => {
      if (event.charCode !== 13) return
      event.preventDefault()
      rename(input.value)
    }

    return (
      <Input
        autoFocus
        defaultValue={title}
        id="renameTitle"
        name="renameTitle"
        onKeyPress={handleKey}
        ref={el => (input = el)}
      />
    )
  }

  return (
    <Wrapper>
      <Text {...rest} archived={archived}>
        {title}
      </Text>
    </Wrapper>
  )
}

export default BookTitle
