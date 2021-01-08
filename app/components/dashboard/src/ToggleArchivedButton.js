import React from 'react'
import styled from 'styled-components'
import { State } from 'react-powerplug'
import { th } from '@pubsweet/ui-toolkit'

import { Button, Icons } from '../../../ui'

const StyledButton = styled(Button)`
  margin-right: ${th('gridUnit')};
`
const { archiveIcon, unArchiveIcon } = Icons

const ToggleArchivedButton = ({ onChange }) => (
  <State initial={{ archived: false }} onChange={onChange}>
    {({ state, setState }) => {
      const { archived } = state

      const toggleArchived = () => {
        setState({ archived: !archived })
      }
      const label = archived ? 'HIDE ARCHIVED' : 'SHOW ARCHIVED'

      return (
        <StyledButton
          icon={archived ? unArchiveIcon : archiveIcon}
          label={label}
          onClick={toggleArchived}
          title={label}
        />
      )
    }}
  </State>
)

export default ToggleArchivedButton
