import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import StateIndicator from './StateIndicator'
import classes from './StateIndicatorWithLabel.local.scss'

const StateIndicatorWithLabel = ({ state, withEnd, title }) => (
  <React.Fragment>
    <div
      className={classNames(classes.root, {
        [classes.active]: state === 0,
        [classes.completed]: state === 1,
      })}
    >
      <span className={classes.left} />
      <span>{title}</span>
      <span className={classes.right} />
    </div>
    <StateIndicator state={state} withEnd={withEnd} />
  </React.Fragment>
)

StateIndicatorWithLabel.propTypes = {
  state: PropTypes.number.isRequired,
  withEnd: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default StateIndicatorWithLabel
