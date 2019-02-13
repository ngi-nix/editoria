import React from 'react'
import styled from 'styled-components'

import { Menu as UIMenu } from '@pubsweet/ui'

import sortIcon from './images/icon_add.svg'

const SortIcon = styled.div`
  background-color: #666;
  cursor: pointer;
  height: 24px;
  mask: url(${sortIcon}) no-repeat 100% 100%;
  mask-size: cover;
  width: 24px;
`

const Menu = styled(UIMenu)`
  display: inline-flex;

  div[role='listbox'] {
    background: white;

    > div:nth-child(2) {
      left: 50%;
      width: 300px;
      transform: translate(-50%, 0);
      z-index: 1;
    }

    div[open] {
      background: white;
      border: 1px solid #666;
      border-radius: 2px;
      box-shadow: 0 2px 10px #666;
      margin-top: 16px;
      position: relative;
      overflow-y: unset;
      width: 300px;

      &::before {
        height: 15px;
        width: 15px;

        content: ' ';
        display: block;
        background: #3f3f3f;
        clip-path: polygon(0% 100%, 50% 50%, 100% 100%);
        position: absolute;
        top: -19px;
        left: calc(50% - 15px / 2);
        z-index: 2000;
      }
    }

    div[role='option'] {
      padding: 4px 8px;

      &::selection {
        background: none;
      }

      &:hover {
        background: #f1f1f1;
      }
    }
  }
`

const IconOpener = ({ toggleMenu }) => (
  <SortIcon onClick={toggleMenu} title="Click to sort books" />
)

const options = [
  {
    label: 'one',
    value: 1,
  },
  {
    label: 'two',
    value: 2,
  },
  {
    label: 'i am long so long this is ridiculous',
    value: 3,
  },
]

const SortMenu = () => <Menu options={options} renderOpener={IconOpener} />

export default SortMenu
