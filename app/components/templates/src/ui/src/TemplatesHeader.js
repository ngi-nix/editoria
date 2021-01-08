import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H3 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

import { Button, Icons } from '../../../../../ui'
import SortMenu from './SortMenu'

const { addIcon } = Icons

const HeaderWrapper = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  position: sticky;
  justify-content: center;
  background-color: white;
  height: calc(9 * ${th('gridUnit')});
  z-index: 1;
  top: 0;
  margin-bottom: calc(1 * ${th('gridUnit')});
`
const Side1 = styled.div`
  align-items: center;
  justify-content: flex-start;
  display: flex;
  flex-basis: 50%;
`
const Side2 = styled.div`
  align-items: center;
  justify-content: flex-end;
  display: flex;
  flex-basis: 50%;
`
const Title = styled(H3)`
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin: 0;
  margin-right: calc(3 * ${th('gridUnit')});
  padding-bottom: 0;
  padding-top: 3px;
  text-transform: uppercase;
`
const InnerWrapper = styled.div`
  flex-basis: 76%;
  display: flex;
`

const TemplatesHeader = props => {
  const { onChangeSort, title, canAddTemplates, onCreateTemplate } = props
  const handleClick = () => {
    onCreateTemplate()
  }

  return (
    <HeaderWrapper>
      <InnerWrapper>
        <Side1>
          <Title>{title}</Title>
          {canAddTemplates && (
            <Button
              icon={addIcon}
              label="ADD TEMPLATE"
              onClick={handleClick}
              title="Add TEMPLATE"
            />
          )}
        </Side1>

        <Side2>
          <SortMenu onChange={onChangeSort} />
        </Side2>
      </InnerWrapper>
    </HeaderWrapper>
  )
}

TemplatesHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default TemplatesHeader
