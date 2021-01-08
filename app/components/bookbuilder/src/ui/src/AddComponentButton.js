import React from 'react'
import { Button, Icons } from '../../../../../ui'

const { addIcon } = Icons

const AddComponentButton = ({ add, label, type, disabled }) => {
  const addComponent = () => {
    add(type)
  }
  return (
    <Button
      disabled={disabled}
      icon={addIcon}
      label={label}
      onClick={addComponent}
      title={label}
    />
  )
}
export default AddComponentButton
