import React from 'react'
import styled from 'styled-components'
import { State } from 'react-powerplug'
import { th } from '@pubsweet/ui-toolkit'
const Button = styled.button`
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  color: #828282;
  display: flex;
  margin-right: calc(3 * ${th('gridUnit')});
  padding: 0;
  border-bottom: 1px solid ${th('colorBackground')};
  svg {
    #folderFill {
      fill: ${({ archived }) => (archived ? '#828282' : 'white')};
    }
  }
  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
    svg {
      #folder {
        fill: ${th('colorPrimary')};
      }
      #folderFill {
        fill: ${({ archived }) => (archived ? th('colorPrimary') : 'white')};
      }
    }
  }
  &:not(:disabled):active {
    border: none;
    color: ${th('colorPrimary')};
    outline: none;
    border-bottom: 1px solid ${th('colorPrimary')};
    svg {
      #folder {
        fill: ${th('colorPrimary')};
      }
      #folderFill {
        fill: ${({ archived }) => (archived ? th('colorPrimary') : 'white')};
      }
    }
  }
  &:focus {
    outline: 0;
  }
`
const Icon = styled.i`
  height: calc(3.5 * ${th('gridUnit')});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: calc(3.5 * ${th('gridUnit')});
`
const Label = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
`

// const ArchiveButtonWrapper = styled.div`
//   cursor: pointer;
//   display: inline-flex;
//   margin-right: 32px;
//   align-items: center;
//   justify-content: center;
//   margin-left: 24px;
// `

// const ArchivedIcon = styled.i`
//   svg {
//     height: 24px;
//     margin-right: 4px;
//     align-self: center;
//     width: 24px;
//     #folderFill {
//       fill: ${({ archived }) => (archived ? '#828282' : 'white')};
//     }
//     #folder {
//       fill: #828282;
//     }
//   }
// `

// const ArchiveButtonText = styled.div`
//   font-family: 'Fira Sans Condensed';
//   color: #666;
//   text-transform: uppercase;
// `
const icon = (
  // <svg
  //   width="24"
  //   height="24"
  //   viewBox="0 0 24 24"
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"
  // >
  //   <rect id="background" width="28" height="28" fill="white" />
  //   <path id="folderFill" d="M9 10H9.94478L12.5539 13.1288H19V17H9V10Z" />
  //   <path
  //     id="folder"
  //     fillRule="evenodd"
  //     clipRule="evenodd"
  //     d="M7.6 18.1402C7.6 18.3222 7.7792 18.4706 8 18.4706H20C20.2208 18.4706 20.4 18.3222 20.4 18.1402V11.5714C20.4 11.3886 20.2208 11.2411 20 11.2411H14C13.76 11.2411 13.5328 11.1378 13.3808 10.9596L11.3008 8.52941H8C7.7792 8.52941 7.6 8.677 7.6 8.859V18.1402ZM20 20H8C6.8976 20 6 19.1657 6 18.1402V8.859C6 7.83353 6.8976 7 8 7H11.6808C11.92 7 12.148 7.10247 12.3 7.28065L14.3792 9.71165H20C21.1024 9.71165 22 10.5452 22 11.5714V18.1402C22 19.1657 21.1024 20 20 20Z"
  //   />
  // </svg>
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Common/Icon/Folder">
      <g id="Common/Icon-background">
        <rect width="28" height="28" fill="white" />
      </g>
      <path
        id="folderFill"
        d="M9 10H9.94478L12.5539 13.1288H19V17H9V10Z"
        fill="#828282"
      />
      <path
        id="folder"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.6 18.1402C7.6 18.3222 7.7792 18.4706 8 18.4706H20C20.2208 18.4706 20.4 18.3222 20.4 18.1402V11.5714C20.4 11.3886 20.2208 11.2411 20 11.2411H14C13.76 11.2411 13.5328 11.1378 13.3808 10.9596L11.3008 8.52941H8C7.7792 8.52941 7.6 8.677 7.6 8.859V18.1402ZM20 20H8C6.8976 20 6 19.1657 6 18.1402V8.859C6 7.83353 6.8976 7 8 7H11.6808C11.92 7 12.148 7.10247 12.3 7.28065L14.3792 9.71165H20C21.1024 9.71165 22 10.5452 22 11.5714V18.1402C22 19.1657 21.1024 20 20 20Z"
        fill="#828282"
      />
    </g>
  </svg>
)
const ToggleArchivedButton = ({ onChange }) => (
  <State initial={{ archived: false }} onChange={onChange}>
    {({ state, setState }) => {
      const { archived } = state

      const toggleArchived = () => {
        setState({ archived: !archived })
      }
      const label = archived ? 'Hide Archived' : 'Show Archived'

      return (
        <Button archived={archived} onClick={toggleArchived}>
          <Icon>{icon}</Icon>
          <Label>{label.toUpperCase()}</Label>
        </Button>
      )
    }}
  </State>
)

export default ToggleArchivedButton
