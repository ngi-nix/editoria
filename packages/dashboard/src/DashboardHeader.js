import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { H1 } from '@pubsweet/ui'

import AddBookButton from './AddBookButton'
import SortMenu from './SortMenu'

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
`

const Side = styled.div`
  align-items: center;
  display: flex;
`

const Title = styled(H1)`
  display: inline-flex;
  font-family: 'Vollkorn' !important;
  margin: 0 !important;
  padding-top: 5px !important;
  text-transform: uppercase;
`

const DashboardHeader = props => {
  const { onChangeSort, title, toggle } = props

  return (
    <HeaderWrapper>
      <Side>
        <Title>{title}</Title>

        <Authorize operation="can add books">
          <AddBookButton onClick={toggle} />
        </Authorize>
      </Side>

      <Side>
        <SortMenu onChange={onChangeSort} />
      </Side>
    </HeaderWrapper>
  )
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default DashboardHeader
