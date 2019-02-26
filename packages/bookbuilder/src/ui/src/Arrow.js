import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { ButtonWithoutLabel } from './Button'

const Arrow = styled(ButtonWithoutLabel)`
  padding: 0;
  visibility: hidden;
  transition: visibility 0.1s ease-in-out 0.1s;
`

export default Arrow
