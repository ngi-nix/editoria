import Authorize from 'pubsweet-client/src/helpers/Authorize'
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
  bookId,
  type,
  currentValues,
}) => {
  const handleInteractionLeft = () => {
    if (disabled) return
    const nextIndex = arrayShift(values, index, 'left')
    update(item.title, item.type, values[nextIndex])
  }

  const handleInteractionRight = () => {
    if (disabled) return
    const nextIndex = arrayShift(values, index, 'right')
    update(item.title, item.type, values[nextIndex])
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

  const renderIndicator = (disabled, side) => {
    // console.log('disabled', disabled)
    // console.log('interactive', interactive)
    // console.log('type', type)
    // console.log('vale', values[index])
    // console.log(
    //   'condL',
    //   disabled || !interactive || (values[index] === 0 || values[index] === -1),
    // )
    // console.log(
    //   'condR',
    //   disabled || !interactive || (values[index] === 1 || values[index] === -1),
    // )
    if (side === 'left') {
      return (
        <button
          className={classes[side]}
          disabled={
            disabled ||
            !interactive ||
            (values[index] === 0 || values[index] === -1)
          }
          onClick={interactive ? handleInteractionLeft : null}
          onKeyPress={interactive ? handleInteractionLeft : null}
        />
      )
    }
    return (
      <button
        className={classes[side]}
        disabled={
          disabled ||
          !interactive ||
          (values[index] === 1 || values[index] === -1)
        }
        onClick={interactive ? handleInteractionRight : null}
        onKeyPress={interactive ? handleInteractionRight : null}
      />
    )
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
        <Authorize
          object={{ bookId, type, currentValues }}
          operation="can change progressList left"
          unauthorized={renderIndicator(true, 'left')}
        >
          {renderIndicator(false, 'left')}
        </Authorize>
        <span>{item.title}</span>
        <Authorize
          object={{ bookId, type, currentValues }}
          operation="can change progressList right"
          unauthorized={renderIndicator(true, 'right')}
        >
          {renderIndicator(false, 'right')}
        </Authorize>
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
