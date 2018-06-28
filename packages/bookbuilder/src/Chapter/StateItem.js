import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import classes from './StateItem.local.scss'

const stateItem = ({ disabled, name, update, values, index }) => {
  const handleInteraction = () => {
    if (disabled) return

    const nextIndex = arrayShift(values, index)
    update(name, nextIndex)
  }

  const arrayShift = (array, i) => (i === array.length - 1 ? 0 : i + 1)

  return (
    // <span
    //   role="button"
    //   tabIndex="0"
    //   className={classNames(classes.root, {
    //     [classes.disabled]: disabled,
    //   })}
    //   onClick={handleInteraction}
    //   onKeyPress={handleInteraction}
    //   disabled={disabled}
    // >
    //   {name}
    // </span>

    <div className={classes.root}>
      <svg viewbox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
        <line id="line" stroke="#C4C4C4" x1="10%" x2="90%" y1="49%" y2="49%" />
        <g id="start">
          <path
            d="M6.95.707l4.242 4.243L6.95 9.192 2.707 4.95 6.95.707z"
            id="start-stroke"
            stroke="#fff"
          />
          <path
            d="M6.95 0l4.95 4.95L6.95 9.9 2 4.95 6.95 0z"
            fill="#4A90E2"
            id="start-front"
          />
        </g>
        <g id="end">
          <path
            d="M6.95.707l4.242 4.243L6.95 9.192 2.707 4.95 6.95.707z"
            id="end-stroke"
            stroke="#fff"
          />
          <path
            d="M6.95 0l4.95 4.95L6.95 9.9 2 4.95 6.95 0z"
            fill="#C4C4C4"
            id="end-front"
          />
        </g>
        <g id="symbol">
          <path
            d="M3.284 1.581l-.47-.306-.25.501-.488.975-.207.413.396.239 2.494 1.503-3.002 1.669-.352.195.116.386.297.988.18.6.546-.31 4.196-2.38.222-.125.029-.253.142-1.253.035-.306-.258-.17-3.626-2.366zm5.363 0l-.47-.306-.25.501-.487.975-.207.413.396.239 2.494 1.503L7.12 6.575l-.352.195.116.386.297.988.18.6.546-.31 4.196-2.38.221-.125.03-.253.142-1.253.035-.306-.259-.17-3.626-2.366z"
            id="symbol-stroke"
            stroke="#fff"
          />
          <path
            d="M3.01 2l3.626 2.367-.142 1.252L2.297 8 2 7.012l3.757-2.089-3.234-1.949L3.01 2zM8.374 2L12 4.367l-.143 1.252L7.661 8l-.297-.988 3.756-2.089-3.233-1.949L8.374 2z"
            fill="#0D78F2"
            id="symbol-front"
          />
        </g>
      </svg>
    </div>
  )
}

stateItem.propTypes = {
  disabled: PropTypes.bool,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  update: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
}

stateItem.defaultProps = {
  disabled: false,
}

export default stateItem
