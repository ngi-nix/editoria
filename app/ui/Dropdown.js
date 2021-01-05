import React, { useState, useRef } from 'react'
import styled from 'styled-components'

import { grid } from '@pubsweet/ui-toolkit'
import Button from './DropdownButton'
import DropComponent from './DropComponent'
import useOnClickOutside from '../helpers/useOnClickOutside'

const Wrapper = styled.div`
  position: relative;
  /* z-index: 202; */
`

const DropWrapper = styled.div`
  background: white;
  margin-top: ${grid(1)};
  position: absolute;
  z-index: 202;
  right: 0px;
`

const Dropdown = props => {
  const {
    className,
    client,
    disabled,
    title,
    dropdownItems,
    logoutUser,
    currentUser,
  } = props

  const [isOpen, setIsOpen] = useState(false)
  // const dropElementRef = useRef(null);
  const ref = useRef()
  useOnClickOutside(ref, () => setIsOpen(false))
  return (
    <Wrapper className={className} ref={ref}>
      <Button
        active={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        title={title}
      />

      {isOpen && (
        <DropWrapper>
          <DropComponent
            client={client}
            currentUser={currentUser}
            dropdownItems={dropdownItems}
            logoutUser={logoutUser}
            setIsOpen={setIsOpen}
          />
        </DropWrapper>
      )}
    </Wrapper>
  )
}

Dropdown.defaultProps = {
  disabled: false,
  iconName: null,
  label: null,
  title: null,
}

export default Dropdown
