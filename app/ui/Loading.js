import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  background: url('/assets/loader.gif');
`

const Loading = () => (
  <Wrapper>
    <Spinner />
  </Wrapper>
)

export default Loading
