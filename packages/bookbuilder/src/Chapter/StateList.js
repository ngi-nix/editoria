import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { map, uniqueId, keys, last } from 'lodash'

import classes from './StateList.local.scss'
import StateItem from './StateItem'

const stateList = ({ bookId, currentValues, update, values }) => {
  const progressIds = keys(values)
  const lastItem = last(progressIds)

  // TODO: Placeholder -- to be implemented with authsome
  // const canAct = key => true

  const handleUpdate = (name, index) => {
    update(name, index)
  }
  const renderStateItem = (
    disabled,
    currentValueIndex,
    name,
    handleUpdate,
    valueList,
  ) => (
    <StateItem
      disabled={disabled}
      index={currentValueIndex}
      name={name}
      update={handleUpdate}
      values={valueList}
    />
  )
  const items = map(values, (stageItem) => {
    let delimiter
    console.log('values', stageItem)
    // console.log('valuesList', valueList)
    // console.log('name', name)
    const type = stageItem.type
    const title = stageItem.title
    const currentValueIndex = currentValues[stageItem.type]

    // if (stageItem.type !== lastItem) {
    //   delimiter = (
    //     <i className={classnames('fa fa-angle-right', classes.delimiter)} />
    //   )
    // }

    return (
      <span className={classes.itemContainer} key={uniqueId()}>
        <Authorize
          object={{ bookId, type, currentValueIndex }}
          operation="can change progressList"
          unauthorized={renderStateItem(
            true,
            currentValueIndex,
            title,
            handleUpdate,
            [],
          )}
        >
          {renderStateItem(
            false,
            currentValueIndex,
            title,
            handleUpdate,
            [],
          )}
        </Authorize>
      </span>
    )
  })

  return <div className={classes.stateListContainer}>{items}</div>
}

stateList.propTypes = {
  bookId: PropTypes.string.isRequired,
  currentValues: PropTypes.objectOf(PropTypes.number).isRequired,
  update: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
}

export default stateList
