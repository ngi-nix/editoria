import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Label = styled.span`
  font-family: 'Fira Sans Condensed';
  font-style:italic;
  color: ${({ active }) => (active ? th('colorText') : th('colorFurniture'))};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  font-size: 14px;
  margin: 0 calc(1 * ${th('gridUnit')});
  transition: visibility 0.1s ease-in-out 0.1s;
`

export default Label
