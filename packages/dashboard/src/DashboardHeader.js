import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { H1 } from '@pubsweet/ui'

import AddBookButton from './AddBookButton'
import ToggleArchivedButton from './ToggleArchivedButton'
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
  font-family: 'Vollkorn';
  padding-top: 6px;
  padding-bottom: 0;
  text-transform: uppercase;
  margin: 0;
`

const DashboardHeader = props => {
  const { onChangeSort, title, collectionId, onAddBook } = props
  const handleClick = () => {
    onAddBook(collectionId)
  }

  return (
    <HeaderWrapper>
      <Side>
        <Title>{title}</Title>

        <Authorize operation="can add books">
          <AddBookButton onClick={handleClick} />
        </Authorize>
      </Side>

      <Side>
        <ToggleArchivedButton onChange={onChangeSort} />
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
