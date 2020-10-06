import { css } from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

export default {
  // TODO
  // -- input padding: breaking the grid?
  // -- small placeholder text? maybe by default?
  Label: css`
    color: #404040;
    margin-bottom: 5px;
  `,
  Input: css`
    border: 2px solid #b0b0b0;
    border-right: 4px solid #484848;
    box-sizing: border-box;
    color: ${props => {
      switch (props.validationStatus) {
        case 'success':
          return props.theme.colorSuccess
        case 'warning':
          return props.theme.colorWarning
        case 'error':
          return props.theme.colorError
        default:
          return 'inherit'
      }
    }};
    height: 34px;
    padding: 6px 12px;
    transition: ${th('transitionDuration')} ${th('transitionTimingFunction')};

    &:focus {
      border-color: ${th('colorPrimary')};
      color: inherit;
    }

    &::placeholder {
      font-size: ${th('fontSizeBaseSmall')};
      line-height: ${th('lineHeightBaseSmall')};
    }
  `,
}
