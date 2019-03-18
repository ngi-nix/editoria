import React from 'react'
import styled, { css } from 'styled-components'

const transition = css`
  transition: 0.2s ease;
`

const Wrapper = styled.div`
  border-radius: 50%;
  cursor: pointer;
  height: 24px;
  margin-left: 4px;
  width: 24px;

  > svg {
    > #up {
      fill: ${props => (props.ascending ? '#0d78f2' : '#3f3f3f')};
      ${transition};
    }

    > #down {
      fill: ${props => (props.ascending ? '#3f3f3f' : '#0d78f2')};
      ${transition};
    }
  }

  &:hover {
    background: #f0f0f0;
    ${transition};
  }
`

const Arrows = props => {
  const { ascending, className, ...rest } = props

  return (
    <Wrapper
      ascending={ascending}
      className={className}
      title={ascending ? 'Ascending' : 'Descending'}
      {...rest}
    >
      <svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11.2857 20L10.7143 20C9.53292 20 8.5715 19.0129 8.5715 17.8L8.5715 10.2594L6.16081 12.2394C5.85296 12.4917 5.40225 12.4411 5.15654 12.125C4.91011 11.8082 4.96011 11.3469 5.26796 11.0939L8.83935 8.1606C8.97007 8.05353 9.12792 8 9.28578 8C9.44363 8 9.60149 8.05353 9.7322 8.1606L13.3036 11.0939C13.6114 11.3469 13.6614 11.8082 13.415 12.125C13.1693 12.4411 12.7193 12.4924 12.4107 12.2394L10.0001 10.2594L10.0001 17.8C10.0001 18.2041 10.3208 18.5333 10.7143 18.5333L11.2857 18.5333C11.68 18.5333 12 18.8619 12 19.2667C12 19.6715 11.68 20 11.2857 20Z"
          id="up"
        />
        <path
          d="M16.2858 8H16.8572C18.0386 8 19 8.98707 19 10.2V17.7406L21.4107 15.7606C21.7186 15.5083 22.1693 15.5589 22.415 15.875C22.6614 16.1918 22.6114 16.6531 22.3036 16.9061L18.7322 19.8394C18.6015 19.9465 18.4436 20 18.2858 20C18.1279 20 17.97 19.9465 17.8393 19.8394L14.2679 16.9061C13.9601 16.6531 13.9101 16.1918 14.1565 15.875C14.4022 15.5589 14.8522 15.5076 15.1608 15.7606L17.5715 17.7406V10.2C17.5715 9.79593 17.2508 9.46667 16.8572 9.46667H16.2858C15.8915 9.46667 15.5715 9.13813 15.5715 8.73333C15.5715 8.32853 15.8915 8 16.2858 8Z"
          id="down"
        />
      </svg>
    </Wrapper>
  )
}

export default Arrows
