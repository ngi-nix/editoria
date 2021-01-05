import styled from 'styled-components'
import { fadeIn, th } from '@pubsweet/ui-toolkit'

const Page = styled.div`
  flex: auto;
  font-family: ${th('fontInterface')};
  height: calc(100% - 45px);
  overflow-y: auto;
  padding: 0;

  > div {
    animation: ${fadeIn} 0.5s;
  }
`

export default Page
