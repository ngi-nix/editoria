import React from 'react'
import PropTypes from 'prop-types'

import AlignmentBoxWithLabel from './AlignmentBoxWithLabel'
import classes from './AlignmentTool.local.scss'

const AlignmentTool = ({ data, onClickAlignmentBox }) => {
  const onClick = event => {
    const { currentTarget } = event
    const { id } = currentTarget
    onClickAlignmentBox(id)
  }
  const leftData = data.left
  const rightData = data.right

  const noBorderRight = { right: true }
  const noBorderLeft = { left: true }

  return (
    <div className={classes.root}>
      <AlignmentBoxWithLabel
        active={leftData}
        id="left"
        labelText="left"
        noBorder={noBorderRight}
        onClick={onClick}
      />

      <div className={classes.middleLine} />

      <AlignmentBoxWithLabel
        active={rightData}
        id="right"
        labelPositionRight
        labelText="right"
        noBorder={noBorderLeft}
        onClick={onClick}
      />
    </div>
  )
}

AlignmentTool.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      active: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onClickAlignmentBox: PropTypes.func.isRequired,
}

export default AlignmentTool
