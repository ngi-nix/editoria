import { findDOMNode } from 'react-dom'

const itemTypes = { BOOK_COMPONENT: 'bookComponent' }

const bookComponentSource = {
  beginDrag(props) {
    const { divisionId, id, no } = props

    return {
      divisionId,
      id,
      no,
    }
  },
  endDrag(props, monitor, component) {
    const params = {
      divisionId: monitor.getItem().divisionId,
      id: monitor.getItem().id,
      no: monitor.getItem().no,
    }
    props.onEndDrag(params)
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id
  },
  canDrag(props, monitor) {
    return props.canDrag
  },
}

const bookComponentTarget = {
  // for an explanation of how this works go to
  // https://github.com/gaearon/react-dnd/blob/master/examples/04%20Sortable/Simple/Card.js

  hover(props, monitor, component) {
    // can only reorder within the same division
    const dragDivision = monitor.getItem().divisionId
    const hoverDivision = props.divisionId

    if (dragDivision !== hoverDivision) return

    const dragIndex = monitor.getItem().no
    const hoverIndex = props.no

    if (dragIndex === hoverIndex) return

    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
    const clientOffset = monitor.getClientOffset()
    const hoverClientY = clientOffset.y - hoverBoundingRect.top

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

    props.onMove(dragIndex, hoverIndex, dragDivision, hoverDivision)
    monitor.getItem().no = hoverIndex
  },
}
/* eslint-disable */
const collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

const collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  }
}
/* eslint-enable */
export {
  bookComponentSource,
  bookComponentTarget,
  collectDrag,
  collectDrop,
  itemTypes,
}
