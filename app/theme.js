import { clone } from 'lodash'

import 'fontsource-fira-sans'
import 'fontsource-fira-sans-condensed'
import 'fontsource-vollkorn'

import { theme } from '@coko/client'

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
editoriaTheme.fontHeading = 'Fira Sans Condensed'
editoriaTheme.fontReading = 'Vollkorn'

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
