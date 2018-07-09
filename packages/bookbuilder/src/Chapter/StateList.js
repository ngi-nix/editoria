import PropTypes from 'prop-types'
import React from 'react'
import config from 'config'
import classnames from 'classnames'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { map, uniqueId, keys, last, indexOf } from 'lodash'

import classes from './StateList.local.scss'
import StateItem from './StateItem'

const stateList = ({ bookId, className, currentValues, update, values }) => {
  // const progressItems = keys(values)
  let stageItems
  if (config && config.bookBuilder && config.bookBuilder.stages) {
    stageItems = config.bookBuilder.stages
  }
  const lastItem = last(stageItems).type
  // console.log('values', values)
  // console.log('progressIds', progressIds)
  // console.log('lastItem', lastItem)
  // console.log('currentValues', currentValues)

  // TODO: Placeholder -- to be implemented with authsome
  // const canAct = key => true

  const handleUpdate = (name, index) => {
    update(name, index)
  }

  const progressOrder = []

  for (let i = 0; i < config.bookBuilder.stages.length; i += 1) {
    progressOrder.push(config.bookBuilder.stages[i].type)
  }

  const renderStateItem = (
    disabled,
    currentValueIndex,
    stageItem,
    handleUpdate,
  ) => (
    <StateItem
      disabled={disabled}
      index={currentValueIndex}
      interactive={stageItem.type !== 'upload'}
      isLast={stageItem.type === lastItem}
      item={stageItem}
      update={handleUpdate}
      values={values}
    />
  )
  const items = map(stageItems, stageItem => {
    const { type } = stageItem
    const currentValueIndex = indexOf(values, currentValues[stageItem.type])
    const previousStageIndex = indexOf(progressOrder, stageItem.type) - 1
    let previousNotDone = false

    if (previousStageIndex !== -1) {
      if (currentValues[progressOrder[previousStageIndex]] !== 1) {
        previousNotDone = true
      }
    }

    return (
      <div className={classes.itemContainer} key={uniqueId()}>
        <Authorize
          object={{ bookId, type, currentValues }}
          operation="can change progressList"
          unauthorized={renderStateItem(
            previousNotDone || true,
            currentValueIndex,
            stageItem,
            handleUpdate,
          )}
        >
          {renderStateItem(
            previousNotDone || false,
            currentValueIndex,
            stageItem,
            handleUpdate,
          )}
        </Authorize>
      </div>
    )
  })
  return (
    <div className={classnames(classes.stateListContainer, classes[className])}>
      {items}
    </div>
  )
}

stateList.propTypes = {
  bookId: PropTypes.string.isRequired,
  currentValues: PropTypes.objectOf(PropTypes.number).isRequired,
  update: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
}

export default stateList
