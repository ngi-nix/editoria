/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { ButtonWithIcon, DefaultButton } from '../ui'

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

const StyledButtonWithIcon = styled(ButtonWithIcon)`
  margin-bottom: calc(${th('gridUnit')} / 2)
`

const StyledButton = styled(DefaultButton)`
  margin-bottom: calc(${th('gridUnit')} / 2)
`

const icon = (
  <svg
    fill="none"
    height="28"
    viewBox="0 0 28 28"
    width="28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Common/Icon/Add">
      <g id="Common/Icon-background">
        <rect fill="white" height="28" width="28" />
      </g>
      <g id="Union">
        <path
          d="M14.8 13.2H16.4C16.84 13.2 17.2 13.56 17.2 14C17.2 14.44 16.84 14.8 16.4 14.8H14.8V16.4C14.8 16.84 14.44 17.2 14 17.2C13.56 17.2 13.2 16.84 13.2 16.4V14.8H11.6C11.16 14.8 10.8 14.44 10.8 14C10.8 13.56 11.16 13.2 11.6 13.2H13.2V11.6C13.2 11.16 13.56 10.8 14 10.8C14.44 10.8 14.8 11.16 14.8 11.6V13.2Z"
          fill="#828282"
        />
        <path
          clipRule="evenodd"
          d="M14 6C9.5888 6 6 9.5888 6 14C6 18.4112 9.5888 22 14 22C18.4112 22 22 18.4112 22 14C22 9.5888 18.4112 6 14 6ZM14 20.4C10.4712 20.4 7.6 17.5288 7.6 14C7.6 10.4712 10.4712 7.6 14 7.6C17.5288 7.6 20.4 10.4712 20.4 14C20.4 17.5288 17.5288 20.4 14 20.4Z"
          fill="#828282"
          fillRule="evenodd"
        />
      </g>
    </g>
  </svg>
)
export class GroupHeader extends React.Component {
  render() {
    const { title, showInput, allowed, show, canViewAddTeamMember } = this.props

    return (
      <GroupHeaderContainer>
        <GroupTitle>{title}</GroupTitle>
        {allowed && canViewAddTeamMember ? (
          !show ? (
            <StyledButtonWithIcon
              icon={icon}
              label={`add ${title}`}
              onClick={showInput}
            />
          ) : (
            <StyledButton label={'hide input'} onClick={showInput} />
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
