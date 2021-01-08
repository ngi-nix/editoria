/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { Button, Icons } from '../../../../ui'

const { addIcon } = Icons
const GroupHeaderContainer = styled.div`
  align-content: center;
  align-items: center;
  display: flex;
  justify-content: flex-start;
`
const GroupTitle = styled.div`
  color: ${th('colorPrimary')};
  font-family: ${th('fontReading')};
  font-size: ${th('fontSizeHeading4')};
  letter-spacing: calc(${th('gridUnit')} / 2);
  line-height: ${th('lineHeightHeading4')};
  margin-right: ${th('gridUnit')};
  text-transform: uppercase;
`

export class GroupHeader extends React.Component {
  render() {
    const { title, showInput, allowed, show, canViewAddTeamMember } = this.props

    return (
      <GroupHeaderContainer>
        <GroupTitle>{title}</GroupTitle>
        {allowed && canViewAddTeamMember ? (
          !show ? (
            <Button
              icon={addIcon}
              label={`Add ${title}`}
              title={`Add ${title}`}
              onClick={showInput}
            />
          ) : (
            <Button
              label={'Hide Input'}
              title={'Hide Input'}
              onClick={showInput}
            />
          )
        ) : null}
      </GroupHeaderContainer>
    )
  }
}

GroupHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showInput: PropTypes.func.isRequired,
}

export default GroupHeader
