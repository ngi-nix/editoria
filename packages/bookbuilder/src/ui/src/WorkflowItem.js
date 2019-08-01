import React from 'react'
import styled from 'styled-components'
import WorkflowIndicator from './WorkflowIndicator'
import Label from './Label'
import Arrow from './Arrow'

// const StyledButton = styled(ButtonWithoutLabel)`
//   padding: 0;
//   visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
//   transition: visibility 0.1s ease-in-out 0.1s;
// `
// const Label = styled.span`
//   font-family: 'Fira Sans Condensed';
//   color: ${({ active }) => (active ? th('colorText') : th('colorFurniture'))};
//   visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
//     /* visibility: hidden; */
//   font-size: 13px;
//   transition: visibility 0.1s ease-in-out 0.1s;
// `
// const LabelArrow = styled.div`
//   font-size: ${th('fontSizeBase')};
//   line-height: ${th('lineHeightBase')};
//   padding-right: 4px;
// `
const FirstRow = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  top: -22px;
  width: 104px;
`

const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
`

const WorkflowItem = ({
  disabled,
  index,
  interactive,
  isLast,
  item,
  update,
  values,
  bookId,
  stage,
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
    const iconRight = (
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
      >
        <path d="M8.59,16.59L13.17,12L8.59,7.41L10,6l6,6l-6,6L8.59,16.59z" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </svg>
    )
    const iconLeft = (
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        enableBackground="new 0 0 24 24"
      >
        <path d="M15.41,16.59L10.83,12l4.58-4.59L14,6l-6,6l6,6L15.41,16.59z" />
        <path fill="none" d="M0,0h24v24H0V0z" />
      </svg>
    )
    if (side === 'left') {
      return (
        <Arrow
          // className={classes[side]}
          // icon={iconLeft}
          id="arrowLeft"
          label="<"
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
      <Arrow
        // className={classes[side]}
        // icon={iconRight}
        id="arrowRight"
        label=">"
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

  const selectedStage = stage.find(stg => stg.type === type)
  let progressListLeft = ''
  let progressListRight = ''
  if (selectedStage.canChangeProgressListLeft) {
    progressListLeft = renderIndicator(false, 'left')
  } else {
    progressListLeft = renderIndicator(true, 'left')
  }

  if (selectedStage.canChangeProgressListRight) {
    progressListRight = renderIndicator(false, 'right')
  } else {
    progressListRight = renderIndicator(true, 'right')
  }

  return (
    <Container
      // className={classNames(classes.root, {
      //   [classes.disabled]: disabled || !interactive,
      //   [classes.active]: values[index] === 0,
      //   [classes.completed]: values[index] === 1,
      // })}
      disabled={disabled}
    >
      {/* <div className={classes.content}> */}
      <FirstRow>
        {progressListLeft}
        <Label id="workLabel" active={values[index] === 0} completed={values[index] === 1}>
          {item.title}
        </Label>
        {progressListRight}
      </FirstRow>
      <WorkflowIndicator id={item.type} state={values[index]} withEnd={isLast} />
    </Container>
  )
}

export default WorkflowItem
