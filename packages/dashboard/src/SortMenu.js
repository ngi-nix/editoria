import React from 'react'
import styled, { css } from 'styled-components'
import { State } from 'react-powerplug'

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
      left: 50%;
      width: 300px;
      transform: translate(-50%, 0);
      z-index: 100;
    }

    div[open] {
      background: white;
      border: 1px solid #666;
      border-radius: 2px;
      box-shadow: 0 2px 10px #666;
      margin-top: 16px;
      position: relative;
      overflow-y: unset;
      text-transform: uppercase;
      width: 300px;

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
      position: relative;

      &::before {
        ${triangleOption}
        opacity: 0;
      }

      &[aria-selected='true'] {
        color: #0d78f2;
        font-weight: normal;

        &::before {
          /* ${triangleOption} */
          background: #0d78f2;
          /* opa */
        }
      }

      &::selection {
        background: none;
      }

      &:hover {
        background: #fafafa;
        color: #0d78f2;
        transition: 0.2s ease-in-out;

        &::before {
          /* ${triangleOption} */
          background: gray;
          opacity: 1;
        }
      }
    }
  }
`

const OpenerWrapper = styled.div`
  display: flex;
  align-items: center;

  > span {
    font-family: 'Fira Sans Condensed';
    margin-right: 8px;
    text-transform: uppercase;

    span {
      cursor: pointer;
      font-weight: 500;
    }
  }
`

const Opener = props => {
  const { ascending, changeOrder, selected, toggleMenu } = props

  return (
    <OpenerWrapper>
      <span>
        Sort By <span onClick={toggleMenu}>{selected}</span>
      </span>

      <SortIcon
        ascending={ascending}
        onClick={changeOrder}
        title={ascending ? 'Ascending' : 'Descending'}
      />
    </OpenerWrapper>
  )
}

const options = [
  {
    label: 'title',
    value: 'title',
  },
  {
    label: 'author',
    value: 'author',
  },
  // {
  //   label: 'i am long so long this is ridiculous',
  //   value: 3,
  // },
]

const SortMenu = () => {
  const sendIt = (value, ascending) => {
    console.log(value, ascending)
  }

  return (
    <State initial={{ ascending: true, value: 'title' }}>
      {({ state, setState }) => {
        const { ascending, value } = state

        const handleChange = value => {
          // console.log(value, ascending)
          setState({ value })
        }

        const changeOrder = () => {
          setState({ ascending: !state.ascending })
          // handleChange()
        }

        return (
          <Menu
            ascending={ascending}
            changeOrder={changeOrder}
            onChange={handleChange}
            options={options}
            renderOpener={Opener}
            selected={value}
          />
        )
      }}
    </State>
  )
}

export default SortMenu
