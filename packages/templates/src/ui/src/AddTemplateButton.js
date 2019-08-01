import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Button = styled.button`
  align-items: center;
  cursor: pointer;
  background: none;
  border: none;
  color: #828282;
  display: flex;
  padding: 0;
  border-bottom: 1px solid ${th('colorBackground')};

  &:not(:disabled):hover {
    color: ${th('colorPrimary')};
    svg {
      #circle {
        fill: ${th('colorPrimary')};
      }
      #cross {
        fill: ${th('colorPrimary')};
      }
    }
  }
  &:not(:disabled):active {
    border: none;
    color: ${th('colorPrimary')};
    outline: none;
    border-bottom: 1px solid ${th('colorPrimary')};
    svg {
      #circle {
        fill: ${th('colorPrimary')};
      }
      #cross {
        fill: ${th('colorPrimary')};
      }
    }
  }
  &:focus {
    outline: 0;
  }
`
const Icon = styled.i`
  height: calc(3.5 * ${th('gridUnit')});
  /* margin: 0 ${th('gridUnit')} 0 0; */
  display: flex;
  align-items:center;
  justify-content: center;  
  padding: 0;
  width: calc(3.5 * ${th('gridUnit')});
`
const Label = styled.span`
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
`
const addTemplateButton = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.79999 7.2H10.4C10.84 7.2 11.2 7.56 11.2 8C11.2 8.44 10.84 8.8 10.4 8.8H8.79999V10.4C8.79999 10.84 8.43999 11.2 7.99999 11.2C7.55999 11.2 7.19999 10.84 7.19999 10.4V8.8H5.59999C5.15999 8.8 4.79999 8.44 4.79999 8C4.79999 7.56 5.15999 7.2 5.59999 7.2H7.19999V5.6C7.19999 5.16 7.55999 4.8 7.99999 4.8C8.43999 4.8 8.79999 5.16 8.79999 5.6V7.2Z"
      fill="#828282"
      id="circle"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      id="cross"
      d="M8 0C3.5888 0 0 3.5888 0 8C0 12.4112 3.5888 16 8 16C12.4112 16 16 12.4112 16 8C16 3.5888 12.4112 0 8 0ZM8 14.4C4.4712 14.4 1.6 11.5288 1.6 8C1.6 4.4712 4.4712 1.6 8 1.6C11.5288 1.6 14.4 4.4712 14.4 8C14.4 11.5288 11.5288 14.4 8 14.4Z"
      fill="#828282"
    />
  </svg>
)

const label = 'Add Template'
const AddTemplateButton = ({ onClick }) => (
  <Button data-cy="add-book-btn" onClick={onClick}>
    <Icon>{addTemplateButton}</Icon>
    <Label>{label.toLocaleUpperCase()}</Label>
  </Button>
)

export default AddTemplateButton
