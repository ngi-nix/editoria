import React, { Component } from 'react'
import styled from 'styled-components'
import { map, clone, find, findIndex } from 'lodash'
import { th } from '@pubsweet/ui-toolkit'
import { difference } from 'lodash'
import { DragDropContext } from 'react-beautiful-dnd'
import Division from './Division'

// import Authorize from 'pubsweet-client/src/helpers/Authorize'
const DivisionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

// const DivisionsArea = ({
//   bookId,
//   divisions,
//   history,
//   addBookComponent,
//   addBookComponents,
//   deleteBookComponent,
//   updateBookComponentPagination,
//   updateBookComponentOrder,
//   updateBookComponentWorkflowState,
//   updateBookComponentContent,
//   updateBookComponentUploading,
//   outerContainer,
//   showModal,
//   showModalToggle,
//   uploading,
// }) => {
//   const renderDivision = (reorderingAllowed, bookComponents, label, id) => {
//     return (
//       <Division
//         add={addBookComponent}
//         addBookComponents={addBookComponents}
//         bookComponents={bookComponents}
//         bookId={bookId}
//         deleteBookComponent={deleteBookComponent}
//         divisionId={id}
//         key={id}
//         label={label}
//         history={history}
//         outerContainer={outerContainer}
//         showModal={showModal}
//         showModalToggle={showModalToggle}
//         reorderingAllowed={reorderingAllowed}
//         updateBookComponentContent={updateBookComponentContent}
//         updateBookComponentOrder={updateBookComponentOrder}
//         updateBookComponentPagination={updateBookComponentPagination}
//         updateBookComponentUploading={updateBookComponentUploading}
//         updateBookComponentWorkflowState={updateBookComponentWorkflowState}
//         uploadStatus={uploading}
//       />
//     )
//   }
//   return (
//     <DivisionsContainer>
//       {map(divisions, division => {
//         const { bookComponents, label, id } = division
//         return (
//           // <Authorize
//           //   object={bookId}
//           //   operation="can reorder bookComponents"
//           //   unauthorized={this.renderDivision(false, bookComponents, label, id)}
//           // >
//           renderDivision(true, bookComponents, label, id)
//           // </Authorize>
//         )
//       })}
//     </DivisionsContainer>
//   )
// }

class DivisionsArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      divisions: props.divisions,
    }
  }
  componentWillReceiveProps(nextProps) {
    // const diff = difference(this.state.divisions, nextProps.divisions)
    // if (diff.length > 0) {
    // console.log('diff', diff)
    this.setState({
      divisions: nextProps.divisions,
    })
    // }
    // return false
  }
  reorder = (array, item, to, from = undefined) => {
    const resArray = []

    for (let i = 0; i < array.length; i += 1) {
      resArray.push(array[i])
    }

    if (from === undefined) {
      resArray.push(item)
      from = from || resArray.length - 1
    }
    const dragged = resArray.splice(from, 1)[0]
    resArray.splice(to, 0, dragged)
    return resArray
  }
  onDragEnd = result => {
    const { updateBookComponentOrder } = this.props
    const { source, destination, draggableId } = result
    const { divisions } = this.state

    if (!destination) {
      return
    }
    const tempState = clone(divisions)
    if (source.droppableId === destination.droppableId) {
      const affected = find(tempState, { id: source.droppableId })

      const divisionIndex = findIndex(tempState, { id: source.droppableId })
      const dragged = find(affected.bookComponents, { id: draggableId })
      const bookComponents = this.reorder(
        affected.bookComponents,
        dragged,
        destination.index,
        source.index,
      )
      affected.bookComponents = bookComponents
      tempState[divisionIndex] = affected
      this.setState({ divisions: tempState })
    } else {
      const affectedSource = find(tempState, { id: source.droppableId })
      const affectedTarget = find(tempState, { id: destination.droppableId })

      const sourceDivisionIndex = findIndex(tempState, {
        id: source.droppableId,
      })
      const destinationDivisionIndex = findIndex(tempState, {
        id: destination.droppableId,
      })
      const dragged = find(affectedSource.bookComponents, { id: draggableId })
      const sourceBookComponentIndex = findIndex(
        affectedSource.bookComponents,
        { id: draggableId },
      )
      affectedSource.bookComponents.splice(sourceBookComponentIndex, 1)
      const targetBookComponents = this.reorder(
        affectedTarget.bookComponents,
        dragged,
        destination.index,
      )
      affectedTarget.bookComponents = targetBookComponents
      tempState[sourceDivisionIndex] = affectedSource
      tempState[destinationDivisionIndex] = affectedTarget
      this.setState({ divisions: tempState })
    }
    updateBookComponentOrder({
      variables: {
        targetDivisionId: destination.droppableId,
        bookComponentId: draggableId,
        index: destination.index,
      },
    })
    // if (source.droppableId === destination.droppableId) {
    //     const items = reorder(
    //         this.getList(source.droppableId),
    //         source.index,
    //         destination.index
    //     );

    //     let state = { items };

    //     if (source.droppableId === 'droppable2') {
    //         state = { selected: items };
    //     }

    //     this.setState(state);
    // } else {
    //     const result = move(
    //         this.getList(source.droppableId),
    //         this.getList(destination.droppableId),
    //         source,
    //         destination
    //     );

    //     this.setState({
    //         items: result.droppable,
    //         selected: result.droppable2
    //     });
    // }
  }

  render() {
    const {
      bookId,
      history,
      addBookComponent,
      addBookComponents,
      deleteBookComponent,
      updateBookComponentPagination,
      updateBookComponentOrder,
      updateBookComponentWorkflowState,
      updateBookComponentContent,
      updateBookComponentUploading,
      outerContainer,
      showModal,
      showModalToggle,
      updateComponentType,
      uploading,
    } = this.props
    const { divisions } = this.state
    const renderDivision = (reorderingAllowed, bookComponents, label, id) => {
      return (
        <Division
          add={addBookComponent}
          addBookComponents={addBookComponents}
          bookComponents={bookComponents}
          bookId={bookId}
          deleteBookComponent={deleteBookComponent}
          divisionId={id}
          key={id}
          label={label}
          history={history}
          outerContainer={outerContainer}
          showModal={showModal}
          showModalToggle={showModalToggle}
          reorderingAllowed={reorderingAllowed}
          updateBookComponentContent={updateBookComponentContent}
          updateBookComponentOrder={updateBookComponentOrder}
          updateBookComponentPagination={updateBookComponentPagination}
          updateBookComponentUploading={updateBookComponentUploading}
          updateBookComponentWorkflowState={updateBookComponentWorkflowState}
          updateComponentType={updateComponentType}
          uploadStatus={uploading}
        />
      )
    }
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <DivisionsContainer>
          {map(divisions, division => {
            const { bookComponents, label, id } = division
            return (
              // <Authorize
              //   object={bookId}
              //   operation="can reorder bookComponents"
              //   unauthorized={this.renderDivision(false, bookComponents, label, id)}
              // >
              renderDivision(true, bookComponents, label, id)
              // </Authorize>
            )
          })}
        </DivisionsContainer>
      </DragDropContext>
    )
  }
}

export default DivisionsArea
