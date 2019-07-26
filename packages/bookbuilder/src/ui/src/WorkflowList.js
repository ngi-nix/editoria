import React from 'react'
import { map, last, indexOf, find } from 'lodash'
import styled from 'styled-components'
import Arrow from './Arrow'
import Label from './Label'
import WorkflowItem from './WorkflowItem'

const Container = styled.div`
  display: flex;
  align-self: flex-end;
  flex-basis: 73%;
  &:hover {
    ${Arrow}:not([disabled]) {
      visibility: visible;
    }
    ${Label} {
      visibility: visible;
    }
  }
`
const WorkflowList = ({
  bookId,
  applicationParameter,
  className,
  currentValues,
  update,
  values,
  bookComponentStateRules,
}) => {
  if (!bookComponentStateRules) return null
  const { stage } = bookComponentStateRules

  const { config: stageItems } = find(applicationParameter, {
    context: 'bookBuilder',
    area: 'stages',
  })

  const lastItem = last(stageItems).type
  const getCurrentValue = (currentObjects, type) => {
    const currentObject = find(currentObjects, ['type', type])
    return currentObject.value
  }

  const handleUpdate = (title, type, index) => {
    update(title, type, index)
  }

  const progressOrder = []

  for (let i = 0; i < stageItems.length; i += 1) {
    progressOrder.push(stageItems[i].type)
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
      stage={stage}
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
    const selectedStage = stage.find(stg => stg.type === type)
    if (selectedStage.canChangeProgressList) {
      return renderStateItem(
        previousNotDone || false,
        currentValueIndex,
        stageItem,
        handleUpdate,
        bookId,
        type,
        currentValues,
      )
    }

    return renderStateItem(
      previousNotDone || true,
      currentValueIndex,
      stageItem,
      handleUpdate,
      bookId,
      type,
      currentValues,
    )
  })
  return <Container>{items}</Container>
}

export default WorkflowList
