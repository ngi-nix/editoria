import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import classes from './StateItem.local.scss'
import StateIndicator from './StateIndicator'
// import StateIndicatorWithLabel from './StateIndicatorWithLabel'

const stateItem = ({
  disabled,
  index,
  interactive,
  isLast,
  item,
  update,
  values,
}) => {
  const handleInteractionLeft = () => {
    if (disabled) return
    const nextIndex = arrayShift(values, index, 'left')
    update(item.type, values[nextIndex])
  }

  const handleInteractionRight = () => {
    if (disabled) return
    const nextIndex = arrayShift(values, index, 'right')
    update(item.type, values[nextIndex])
  }

  const arrayShift = (array, i, direction) => {
    let newValue
    switch (direction) {
      case 'left':
        newValue = i - 1
        break
      default:
        newValue = i + 1
        break
    }
    return newValue
  }

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
    <div
      className={classNames(classes.root, {
        [classes.disabled]: disabled || !interactive,
        [classes.active]: values[index] === 0,
        [classes.completed]: values[index] === 1,
      })}
      disabled={disabled}
      // onClick={interactive ? handleInteraction : null}
      // onKeyPress={interactive ? handleInteraction : null}
      // role="button"
      // tabIndex="0"
    >
      <div className={classes.content}>
        <button
          className={classes.left}
          disabled={disabled || !interactive || values[index] === -1}
          onClick={interactive ? handleInteractionLeft : null}
          onKeyPress={interactive ? handleInteractionLeft : null}
        />
        <span>{item.title}</span>
        <button
          className={classes.right}
          disabled={disabled || !interactive || values[index] === 1}
          onClick={interactive ? handleInteractionRight : null}
          onKeyPress={interactive ? handleInteractionRight : null}
        />
      </div>
      <StateIndicator state={values[index]} withEnd={isLast} />
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
