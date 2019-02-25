import PropTypes from 'prop-types'
import React from 'react'
import config from 'config'
// import Authorize from 'pubsweet-client/src/helpers/Authorize'
import { map, uniqueId, last, indexOf, find } from 'lodash'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import Arrow from './Arrow'
import Label from './Label'
import WorkflowItem from './WorkflowItem'
const Container = styled.div`
  display: flex;
  flex-basis: 65%;
  &:hover {
    ${Arrow}:not([disabled]) {
      visibility: visible;
    }
    ${Label} {
      visibility: visible;
    }
  }
`
const WorkflowList = ({ bookId, className, currentValues, update, values }) => {
  let stageItems
  if (config && config.bookBuilder && config.bookBuilder.stages) {
    stageItems = config.bookBuilder.stages
  }
  const lastItem = last(stageItems).type
  const getCurrentValue = (currentObjects, type) => {
    const currentObject = find(currentObjects, ['type', type])
    return currentObject.value
  }

  const handleUpdate = (title, type, index) => {
    update(title, type, index)
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
    bookId,
    type,
    currentValues,
  ) => (
    <WorkflowItem
      bookId={bookId}
      currentValues={currentValues}
      disabled={disabled}
      index={currentValueIndex}
      interactive={stageItem.type !== 'upload'}
      isLast={stageItem.type === lastItem}
      item={stageItem}
      type={type}
      update={handleUpdate}
      values={values}
    />
  )
  const items = map(stageItems, stageItem => {
    const { type } = stageItem
    const currentValueIndex = indexOf(
      values,
      getCurrentValue(currentValues, stageItem.type),
    )
    const previousStageIndex = indexOf(progressOrder, stageItem.type) - 1
    let previousNotDone = false

    if (previousStageIndex !== -1) {
      if (
        getCurrentValue(currentValues, progressOrder[previousStageIndex]) !== 1
      ) {
        previousNotDone = true
      }
    }

    // return (
      // <Authorize
      //   object={{ bookId, type, currentValues }}
      //   operation="can change progressList"
      //   unauthorized={renderStateItem(
      //     previousNotDone || true,
      //     currentValueIndex,
      //     stageItem,
      //     handleUpdate,
      //     bookId,
      //     type,
      //     currentValues,
      //   )}
      // >
       return renderStateItem(
          previousNotDone || false,
          currentValueIndex,
          stageItem,
          handleUpdate,
          bookId,
          type,
          currentValues,
        )
      {/* </Authorize> */}
    // )
  })
  return <Container>{items}</Container>
}

export default WorkflowList
