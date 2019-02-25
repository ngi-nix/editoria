import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import { State } from 'react-powerplug'
import { find, map } from 'lodash'
import config from 'config'
import { th } from '@pubsweet/ui-toolkit'

import { Menu as UIMenu } from '@pubsweet/ui'

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
const rotate = keyframes`
from { transform: rotate(0deg);}
    to {  transform: rotate(360deg); } 
`

const SettingsIcon = styled.span`
  height: calc(4 * ${th('gridUnit')});
  width: calc(4 * ${th('gridUnit')});
  svg {
    height: auto;

    padding: 0;
    width: calc(4 * ${th('gridUnit')});
    #outer {
      stroke: ${th('colorBackground')};
    }
    #inner {
      fill: ${th('colorBackground')};
    }
    #icon {
      fill: ${th('colorFurniture')};
    }
  }

  &:hover {
    cursor: pointer;
    svg {
      #outer {
        stroke: ${th('colorBackground')};
      }
      #inner {
        fill: ${th('colorBackgroundHue')};
      }
      #icon {
        fill: ${th('colorPrimary')};
      }
    }
  }
  &:active {
    cursor: pointer;
    svg {
      animation: ${rotate} 0.9s ease-in-out;
      #outer {
        stroke: ${th('colorPrimary')};
      }
      #inner {
        fill: ${th('colorPrimary')};
      }
      #icon {
        fill: ${th('colorBackground')};
      }
    }
  }
  &:focus {
    svg {
      #outer {
        stroke: ${th('colorPrimary')};
      }
    }
  }
`
const settingsIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="42"
    fill="none"
    viewBox="0 0 42 42"
  >
    <path
      id="outer"
      fill="transparent"
      strokeWidth="6"
      d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
    />
    <path
      id="inner"
      stroke="white"
      strokeWidth="3"
      d="M4 21C4 11.6112 11.6112 4.00001 21 4.00001C30.3888 4.00001 38 11.6112 38 21C38 30.3888 30.3888 38 21 38C11.6112 38 4 30.3888 4 21Z"
    />

    <g id="icon">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.8612 33H22.1316C23.2452 33 24.1512 32.094 24.1512 30.9804V29.6796C24.1512 29.5032 24.2916 29.3832 24.4668 29.31C24.5988 29.2548 24.786 29.2404 24.912 29.3664L25.83 30.2892C26.2104 30.672 26.718 30.882 27.2568 30.882H27.2592C27.798 30.882 28.3032 30.6732 28.6848 30.2916L30.2928 28.6836C31.0776 27.8988 31.0776 26.6196 30.2928 25.8312L29.3676 24.9072C29.2428 24.7824 29.2572 24.5964 29.3124 24.4632C29.3124 24.4632 29.3149 24.4573 29.3175 24.451C29.3222 24.4396 29.3292 24.4236 29.3292 24.4236C29.3832 24.2916 29.5044 24.15 29.6808 24.15H30.9888C32.0988 24.15 33 23.2488 33 22.1388V19.8684C33 18.7548 32.0952 17.85 30.9816 17.85H29.6808C29.5032 17.85 29.3832 17.7096 29.3112 17.5332C29.2548 17.4 29.2416 17.2152 29.3676 17.0892L30.2904 16.17C30.6732 15.7896 30.8832 15.282 30.8832 14.7444C30.8844 14.2044 30.6756 13.698 30.294 13.3176L28.6848 11.7084C27.8988 10.9212 26.6196 10.9236 25.8324 11.7084L24.9084 12.6336C24.7824 12.7596 24.5976 12.744 24.4236 12.672C24.2916 12.618 24.1512 12.4968 24.1512 12.3204V11.0112C24.1512 9.9024 23.2488 9 22.14 9H19.8696C18.756 9 17.85 9.906 17.85 11.0196V12.3204C17.85 12.4968 17.7096 12.6168 17.5344 12.69C17.4012 12.7464 17.2152 12.7608 17.0892 12.6336L16.1712 11.7108C15.7908 11.328 15.2832 11.118 14.7444 11.118H14.742C14.2032 11.118 13.698 11.3268 13.3164 11.7084L11.7084 13.3164C10.9236 14.1012 10.9236 15.3804 11.7084 16.1688L12.6336 17.0928C12.7584 17.2176 12.744 17.4036 12.672 17.5764C12.618 17.7084 12.4968 17.85 12.3204 17.85H11.0124C9.9024 17.85 9 18.7512 9 19.8612V22.1316C9 23.2452 9.906 24.15 11.0196 24.15H12.3204C12.498 24.15 12.618 24.2904 12.69 24.4668C12.7464 24.6 12.7596 24.7848 12.6336 24.9108L11.712 25.8288C11.3292 26.2104 11.1192 26.7168 11.118 27.2556C11.118 27.7956 11.3268 28.302 11.7084 28.6836L13.3164 30.2916C14.1024 31.0788 15.3816 31.0764 16.1688 30.2916L17.0928 29.3664C17.22 29.2428 17.4048 29.2572 17.5776 29.328C17.7096 29.382 17.85 29.5032 17.85 29.6796V30.9888C17.85 32.0976 18.7524 33 19.8612 33ZM21.751 30.6H20.2498V29.6796C20.2498 28.5576 19.5586 27.5496 18.463 27.0972C17.3938 26.6508 16.1902 26.8752 15.3958 27.6696L14.7418 28.3236L13.6774 27.2592L14.3266 26.6124C15.1258 25.8168 15.3526 24.6108 14.8906 23.5068C14.4514 22.44 13.4422 21.75 12.3202 21.75H11.3998V20.25H12.3202C13.4422 20.25 14.4514 19.5588 14.9026 18.4632C15.3502 17.394 15.1246 16.1892 14.3302 15.3948L13.6762 14.742L14.7418 13.6764L15.3886 14.3256C16.1842 15.126 17.3902 15.3528 18.493 14.8908C19.5598 14.4504 20.2498 13.4424 20.2498 12.3204V11.4H21.751V12.3204C21.751 13.4424 22.4422 14.4504 23.5378 14.9028C24.607 15.3492 25.8106 15.1248 26.605 14.3304L27.259 13.6764L28.3234 14.7408L27.6742 15.3876C26.875 16.1832 26.6482 17.3892 27.1102 18.4932C27.5494 19.56 28.5586 20.25 29.6806 20.25H30.5998V21.75H29.6806C28.5586 21.75 27.5494 22.4412 27.1126 23.5008L27.0994 23.5344L27.0982 23.5368C26.6506 24.606 26.875 25.8108 27.6706 26.6052L28.3246 27.258L27.259 28.3236L26.6122 27.6744C25.8178 26.8752 24.6118 26.6496 23.5078 27.1092C22.441 27.5496 21.751 28.5576 21.751 29.6796V30.6Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8004 21C16.8004 23.316 18.6844 25.2 21.0004 25.2C23.3164 25.2 25.2004 23.316 25.2004 21C25.2004 18.684 23.3164 16.8 21.0004 16.8C18.6844 16.8 16.8004 18.684 16.8004 21ZM19.2007 21C19.2007 20.0076 20.0083 19.2 21.0007 19.2C21.9931 19.2 22.8007 20.0076 22.8007 21C22.8007 21.9924 21.9931 22.8 21.0007 22.8C20.0083 22.8 19.2007 21.9924 19.2007 21Z"
      />
    </g>
  </svg>
)
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
      transform: translate(-50%, 0);
      width: 120px;
      z-index: 100;
    }

    div[open] {
      background: white;
      border: 1px solid #666;
      box-shadow: 0 2px 10px #666;
      margin-top: 16px;
      overflow-y: unset;
      position: relative;
      text-transform: uppercase;
      width: 120px;

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

      &::selection {
        background: none;
      }

      &::before {
        ${triangleOption}
        opacity: 0;
      }

      &[aria-selected='true'] {
        color: #0d78f2;
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
    text-transform: uppercase;

    span {
      cursor: pointer;
      font-weight: 500;
    }
  }
`

const Opener = props => {
  const { toggleMenu } = props

  return (
    <OpenerWrapper>
      <SettingsIcon onClick={toggleMenu}>{settingsIcon}</SettingsIcon>
    </OpenerWrapper>
  )
}

const ComponentTypeMenu = ({ onChange, divisionType, componentType }) => {
  const divisions = config.bookBuilder.divisions
  const division = find(divisions, { name: divisionType })

  const options = map(division.allowedComponentTypes, componentType => ({
    label: componentType,
    value: componentType,
  }))
  return (
    <State initial={{ componentType }} onChange={onChange}>
      {({ state, setState }) => {
        const { componentType } = state

        const handleChangeComponentType = value => {
          setState({ componentType: value })
        }

        return (
          <Menu
            onChange={handleChangeComponentType}
            options={options}
            renderOpener={Opener}
            value={componentType}
          />
        )
      }}
    </State>
  )
}
export default ComponentTypeMenu
