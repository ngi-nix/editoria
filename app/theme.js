/* eslint-disable import/extensions */
// import 'typeface-fira-sans'
import theme from '@pubsweet/coko-theme'
import { clone } from 'lodash'
import {
  FormContainer,
  TextField,
  Heading,
  Button,
  Logo,
  Action,
  AppBar,
} from './elements'

const editoriaTheme = clone(theme)
editoriaTheme.fontInterface = 'Fira Sans'
editoriaTheme.cssOverrides = {
  ui: {
    TextField,
    H1: Heading.H1,
    Button,
    Action,
    AppBar,
  },
  Login: {
    FormContainer,
    Logo,
  },
}

export default editoriaTheme
