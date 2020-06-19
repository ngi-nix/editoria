import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

import { IconButton } from '../ui'

const Input = styled.input`
  border: 0;
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  outline: 0;
  padding: 0;
  width: 84.2%;

  &:focus {
    border-bottom: 1px dashed ${th('colorPrimary')};
    outline: 0;
  }
  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`
const PlainItem = styled.div`
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  text-align: left;
  width: 100%;
`
const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  width: 100%;
`
const Actions = styled.div`
  display: flex;
  width: 15.8%;
`

const editIcon = (
  <svg fill="#111" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

const cancelIcon = (
  <svg fill="#111" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
)

const saveIcon = (
  <svg fill="#111" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
  </svg>
)
class InfoItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      initialValue: props.value,
      newValue: props.value,
      focus: false,
      editMode: false,
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleEditMode = this.handleEditMode.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.renderItem = this.renderItem.bind(this)
  }

  handleKeyPress(e) {
    this.setState({ newValue: e.target.value })
  }

  handleEditMode(e) {
    this.setState({ editMode: true, focus: true })
  }

  handleSave(e) {
    const { updateFile, type } = this.props
    const { newValue } = this.state
    const self = this
    updateFile({ [type]: newValue }).then(() =>
      self.setState({ editMode: false, initialValue: newValue, focus: false }),
    )
  }

  handleCancel(e) {
    const { initialValue } = this.state
    this.setState({ editMode: false, newValue: initialValue, focus: false })
  }

  renderItem() {
    const { editable, value } = this.props
    const { newValue, editMode, focus } = this.state
    if (editable) {
      return !editMode ? (
        <Fragment>
          <PlainItem>{value}</PlainItem>
          <Actions>
            <IconButton icon={editIcon} onClick={this.handleEditMode} />
          </Actions>
        </Fragment>
      ) : (
        <Fragment>
          <Input
            autoFocus={focus}
            onChange={this.handleKeyPress}
            type="text"
            value={newValue}
          />
          <Actions>
            <IconButton icon={saveIcon} onClick={this.handleSave} />
            <IconButton icon={cancelIcon} onClick={this.handleCancel} />
          </Actions>
        </Fragment>
      )
    }
    return <PlainItem>{value}</PlainItem>
  }

  render() {
    return <Wrapper>{this.renderItem()}</Wrapper>
  }
}

export default InfoItem
