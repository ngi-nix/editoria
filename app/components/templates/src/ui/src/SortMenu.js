import React from 'react'
import styled, { css } from 'styled-components'
import { State } from 'react-powerplug'
import { th } from '@pubsweet/ui-toolkit'

import { Menu as UIMenu } from '@pubsweet/ui'

import SortIcon from './SortIcon'

const triangle = css`
  background: #3f3f3f;
  content: ' ';
  display: block;
  height: 15px;
  position: absolute;
  transition: 0.2s ease-in-out;
  width: 15px;
  z-index: 200;
`

const triangleLeft = css`
  ${triangle};
  clip-path: polygon(49% 49%, 0 0, 0 100%);
`

const triangleUp = css`
  ${triangle};
  clip-path: polygon(0% 100%, 50% 50%, 100% 100%);
`

const triangleOption = css`
  ${triangleLeft};
  left: 0;
  top: 8px;
`

const Menu = styled(UIMenu)`
  display: inline-flex;

  div[role='listbox'] {
    background: white;

    > div:nth-child(2) {
      left: 95%;
      transform: translate(-95%, 0);
      width: 100px;
      z-index: 100;
    }

    div[open] {
      background: white;
      border: 1px solid #666;
      box-shadow: 0 2px 10px #666;
      margin-top: 16px;
      position: relative;
      overflow-y: unset;
      text-transform: uppercase;
      width: 100px;

      &::before {
        ${triangleUp}
        left: calc(50% - 15px / 2);
        top: -19px;
      }
    }

    div[role='option'] {
      cursor: pointer;
      font-family: 'Fira Sans Condensed';
      padding: 4px 4px 4px 12px;
      font-size: ${th('fontSizeBase')};
      line-height: ${th('lineHeightBase')};
      color: ${th('colorText')};
      position: relative;

      &::selection {
        background: none;
      }

      &::before {
        ${triangleOption}
        opacity: 0;
      }

      &[aria-selected='true'] {
        color: ${th('colorPrimary')};
        font-weight: normal;

        &::before {
          background: #0d78f2;
          opacity: 1;
        }
      }

      &:hover {
        background: #fafafa;
        color: #0d78f2;
        transition: 0.2s ease-in-out;

        &::before {
          background: #0d78f2;
          opacity: 1;
        }
      }
    }
  }
`

const OpenerWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};

  > span {
    font-family: 'Fira Sans Condensed';
    text-transform: uppercase;
    color: ${th('colorText')};

    span {
      cursor: pointer;
      color: ${th('colorText')};
      font-weight: bold;
    }
  }
`

const Opener = props => {
  const { ascending, onChangeSortOrder, selected, toggleMenu } = props

  return (
    <OpenerWrapper>
      <span>
        Sort By <span onClick={toggleMenu}>{selected}</span>
      </span>

      <SortIcon ascending={ascending} onClick={onChangeSortOrder} />
    </OpenerWrapper>
  )
}

const options = [
  {
    label: 'name',
    value: 'name',
  },
  {
    label: 'author',
    value: 'author',
  },
  {
    label: 'target type',
    value: 'targetType',
  },
]

const SortMenu = ({ onChange }) => (
  <State initial={{ ascending: true, sortKey: 'name' }} onChange={onChange}>
    {({ state, setState }) => {
      const { ascending, sortKey } = state

      const handleChangeSortKey = value => {
        setState({ sortKey: value })
      }

      const handleChangeSortOrder = () => {
        setState({ ascending: !state.ascending })
      }

      return (
        <Menu
          ascending={ascending}
          onChange={handleChangeSortKey}
          onChangeSortOrder={handleChangeSortOrder}
          options={options}
          renderOpener={Opener}
          value={sortKey}
        />
      )
    }}
  </State>
)

export default SortMenu
