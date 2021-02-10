import { clone } from 'lodash'

import 'fontsource-fira-sans'
import 'fontsource-fira-sans-condensed'
import 'fontsource-vollkorn'
import 'fontsource-merriweather'
import 'typeface-inter'

import { theme } from '@coko/client'

import {
  FormContainer,
  TextField,
  Heading,
  Button,
  Logo,
  Action,
  LogoLink,
} from './elements'

const editoriaTheme = clone(theme)

editoriaTheme.fontInterface = 'Fira Sans'
editoriaTheme.fontHeading = 'Fira Sans Condensed'
editoriaTheme.fontReading = 'Vollkorn'
editoriaTheme.colorBackgroundTabs = '#e1ebff'
editoriaTheme.colorBackgroundToolBar = '#fff'
editoriaTheme.fontWriting = 'Merriweather'
editoriaTheme.fontTools = 'Inter'
editoriaTheme.colorSelection = '#C5D7FE'
editoriaTheme.colorBackgroundButton = '#0042C7'

editoriaTheme.cssOverrides = {
  ui: {
    TextField,
    H1: Heading.H1,
    Button,
    Action,
    AppBar: {
      LogoLink,
    },
  },
  Login: {
    FormContainer,
    Logo,
  },
}

export default editoriaTheme
