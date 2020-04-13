import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import DialogModal from 'editoria-common/src/DialogModal'
import ModalBody from 'editoria-common/src/ModalBody'
import ModalFooter from 'editoria-common/src/ModalFooter'
import { th, darken, lighten } from '@pubsweet/ui-toolkit'
import { ButtonWithoutLabel, ButtonWithIcon, DefaultButton } from '../ui'
import { Formik } from 'formik'
import { indexOf } from 'lodash'

const U = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

// const StyledButton1 = styled(DefaultButton)`
//   background: ${th('colorPrimary')};
//   color: white;
// `
// const StyledButton2 = styled(DefaultButton)`
//   background: ${th('colorError')};
//   color: white;
// `
const Universe = styled.div`
  /* border-bottom: 1px solid black; */
  align-items: center;
  display: flex;
  height: 90%;
  margin-bottom: 8px;
  width: 100%;
`

const PreviewWrapper = styled.div`
  align-items: center;
  /* border-left: solid 1px black; */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* height: 100%; */
  justify-content: center;
  padding-left: 16px;
  /* transition: flex-grow 0.1s ease-out; */
  /* padding-right: 16px; */
  /* width: 40%; */
`
const TableWrapper = styled.div`
  /* border: 1px solid black; */
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  height: 100%;
  justify-content: flex-start;
  overflow-y: auto;
  /* transition: flex-grow 0.1s ease-out; */
  /* width: ${({ selected }) => (selected ? '60%' : '100%')}; */
`
const TableHead = styled.div`
  /* align-content: flex-start; */
  display: flex;
  /* padding-left: 16px;
  padding-right: 16px; */
  position: sticky;
  top: 0;
  width: 100%;
`
const TableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* padding-left: 16px;
  padding-right: 16px; */
  /* overflow-y: auto; */
`
const TableRow = styled.div`
  /* align-content: flex-start; */
  background: ${({ selected }) => (selected ? th('colorPrimary') : 'inherit')};
  color: ${({ selected }) => (selected ? 'white' : 'inherit')};
  cursor: pointer;
  display: flex;
  user-select: none;
  width: 100%;
  &:nth-child(even) {
    background: ${({ selected }) =>
      selected ? th('colorPrimary') : th('colorBackgroundHue')};
  }
  &:hover {
    background: ${th('colorPrimary')};
    color: white;
  }
`

const icon = (
  <svg viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
    />
  </svg>
)

const upIcon = (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Common/Icon/Upload">
      <rect width="28" height="28" fill="white" />
      <g id="Common/Icon-background">
        <rect width="28" height="28" fill="white" />
      </g>
      <g id="Vector">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.5658 13.9109C14.2578 13.5892 13.7594 13.5867 13.4442 13.9001L11.0442 16.3142C10.7266 16.6342 10.7178 17.1609 11.025 17.4925C11.3322 17.8234 11.8386 17.8342 12.1562 17.5134L13.2002 16.4634V21.1667C13.2002 21.6275 13.5586 22 14.0002 22C14.4418 22 14.8002 21.6275 14.8002 21.1667V16.5117L15.8346 17.5892C15.9906 17.7517 16.1954 17.8334 16.4002 17.8334C16.605 17.8334 16.8098 17.7517 16.9658 17.5892C17.2786 17.2634 17.2786 16.7367 16.9658 16.4109L14.5658 13.9109Z"
          fill="#828282"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.54 10.3708C17.884 8.38416 16.0648 7 14 7C11.936 7 10.1168 8.38416 9.46 10.3708C7.5088 10.6466 6 12.3933 6 14.4999C6 15.5174 6.3552 16.4966 7.0008 17.2574C7.2928 17.6016 7.7984 17.6358 8.1296 17.3308C8.4608 17.0249 8.492 16.4991 8.2 16.1533C7.8128 15.6983 7.6 15.1099 7.6 14.4999C7.6 13.1216 8.6768 12 10 12H10.08C10.4608 12 10.7896 11.72 10.8648 11.3308C11.1632 9.78748 12.4824 8.66665 14 8.66665C15.5184 8.66665 16.8368 9.78748 17.136 11.3308C17.2112 11.72 17.5392 12 17.92 12H18C19.3232 12 20.4 13.1216 20.4 14.4999C20.4 15.1099 20.1872 15.6983 19.8008 16.1533C19.508 16.4991 19.54 17.0249 19.8704 17.3308C20.0232 17.4708 20.212 17.5391 20.4 17.5391C20.6216 17.5391 20.8416 17.4433 21 17.2574C21.6448 16.4966 22 15.5174 22 14.4999C22 12.3933 20.4912 10.6466 18.54 10.3708Z"
          fill="#828282"
        />
      </g>
    </g>
  </svg>
)

const Actions = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
`
const ClosePreview = styled.div`
  display: flex;
  height: 28px;
  justify-content: flex-end;
  margin-bottom: 8px;
  width: 100%;
`

const Input = styled.input`
  width: 100%;
  line-height: ${th('lineHeightBase')};
  font-family: 'Fira Sans Condensed';
  font-size: ${th('fontSizeBase')};
  margin-bottom: 8px;
  border: 0;
  padding: 0;
  outline: 0;

  &:focus {
    outline: 0;
    border-bottom: 1px dashed ${th('colorPrimary')};
  }
  &:placeholder-shown {
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
  }
`

const ImagePreviewer = styled.div`
  border: 1px solid black;
  height: 300px;
  margin-bottom: 8px;
  width: 300px;
`

const TableCell = styled.div`
  /* border: 1px solid black; */
  /* align-content: flex-start; */
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBaseSmall')};
  line-height: ${th('lineHeightBaseSmall')};
  padding: 8px;
  text-align: left;
  width: ${({ width }) => (width ? `${width}%` : '33.33%')};
`

const TableHeadCell = styled.div`
  /* align-content: flex-start; */
  background: ${th('colorFurniture')};
  font-family: ${th('fontHeading')};
  font-size: ${th('fontSizeBase')};
  line-height: ${th('lineHeightBase')};
  padding: 8px;
  text-align: left;
  /* border: 1px solid black; */
  width: ${({ width }) => (width ? `${width}%` : '33.33%')};
`

class AssetManager extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
      selected: undefined,
      all: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
      13: false,
      14: false,
    }
  }

  selectItem = item => {
    const { selected } = this.state

    if (item) {
      this.setState({
        selected: selected && selected.id === item.id ? undefined : item,
        // [item.id]: !this.state[item.id],
      })
    } else {
      this.setState({
        selected: undefined,
        // [item.id]: !this.state[item.id],
      })
    }
  }

  toggleSelection = id => {
    // const selectedFiles = this.state.sf
    // if (selectedFiles.length === 0) {
    //   selectedFiles.push(id)
    // } else {
    //   const fileFound = indexOf(selectedFiles, id)
    //   if (fileFound !== -1) {
    //     selectedFiles.splice(fileFound, 1)
    //   } else {
    //     selectedFiles.push(id)
    //   }
    // }
    this.setState({ [id]: !this.state[id] })
  }

  toggleAll = id => {
    const what = !this.state.all
    // const selectedFiles = this.state.sf
    // if (selectedFiles.length === 0) {
    //   selectedFiles.push(id)
    // } else {
    //   const fileFound = indexOf(selectedFiles, id)
    //   if (fileFound !== -1) {
    //     selectedFiles.splice(fileFound, 1)
    //   } else {
    //     selectedFiles.push(id)
    //   }
    // }
    this.setState({
      all: what,
      1: what,
      2: what,
      3: what,
      4: what,
      5: what,
      6: what,
      7: what,
      8: what,
      9: what,
      10: what,
      11: what,
      12: what,
      13: what,
      14: what,
    })
  }

  renderBody() {
    const { data, hideModal } = this.props
    const { selected: selectedItem, sf } = this.state
    console.log('sel', sf)
    const dummy = [
      {
        id: 1,
        label: 'some files 1',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 2,
        label: 'some files 2',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 3,
        label: 'some files 3',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 4,
        label: 'some files 4',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 5,
        label: 'some files 5',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 6,
        label: 'some files 6',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 7,
        label: 'some files 7',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 8,
        label: 'some files 8',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 9,
        label: 'some files 9',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 10,
        label: 'some files 10',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 11,
        label: 'some files 11',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 12,
        label: 'some files 12',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 13,
        label: 'some files 13',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 14,
        label: 'some files 14',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
      {
        id: 15,
        label: 'some files 15',
        caption: 'This is a caption which will be displayed in the chapter',
        'alt-text': 'this is a figure of something',
        size: '500kB',
        mimetype: 'image/jpeg',
        aspectRatio: '4:3',
        uploaded: '02/03/2020 23:15:00',
      },
    ]

    return (
      <U>
        <Universe>
          <TableWrapper>
            <TableHead>
              <TableHeadCell width={2}>
                <input
                  checked={this.state.all}
                  onChange={e => {
                    this.toggleAll()
                  }}
                  type="checkbox"
                />
              </TableHeadCell>
              <TableHeadCell width={30}>Filename</TableHeadCell>
              {/* <TableHeadCell width={28}>Alt-text</TableHeadCell> */}
              <TableHeadCell width={30}>Uploaded</TableHeadCell>
              <TableHeadCell width={15}>Size</TableHeadCell>
              <TableHeadCell width={25}>Mimetype</TableHeadCell>
            </TableHead>
            <TableBody>
              {dummy &&
                dummy.map(item => {
                  const {
                    id,
                    label,
                    caption,
                    'alt-text': alt,
                    size,
                    mimetype,
                    aspectRatio,
                    uploaded,
                  } = item
                  return (
                    <TableRow
                      key={id}
                      onClick={e => {
                        // e.preventDefault()
                        this.selectItem(item)
                      }}
                      selected={selectedItem && selectedItem.id === id}
                    >
                      <TableCell width={2}>
                        <input
                          checked={this.state[id]}
                          onChange={e => {
                            this.toggleSelection(id)
                          }}
                          type="checkbox"
                        />
                      </TableCell>
                      <TableCell width={30}>{label}</TableCell>
                      {/* <TableCell width={25}>{caption}</TableCell> */}
                      {/* <TableCell width={28}>{alt}</TableCell> */}
                      <TableCell width={30}>{uploaded}</TableCell>
                      <TableCell width={15}>{size}</TableCell>
                      <TableCell width={25}>{mimetype}</TableCell>
                      {/* <TableCell width={5}>{aspectRatio}</TableCell> */}
                    </TableRow>
                  )
                })}
            </TableBody>
          </TableWrapper>
          {/* {selectedItem && ( */}
          <PreviewWrapper>
            {/* <ClosePreview>
              <ButtonWithoutLabel
                icon={icon}
                onClick={e => {
                  e.preventDefault()
                  this.selectItem(undefined)
                }}
              />
            </ClosePreview> */}
            <ImagePreviewer />
            <Input value={selectedItem ? selectedItem.label : ''} />
            {/* <Input value={selectedItem.caption} /> */}
            <Input value={selectedItem ? selectedItem['alt-text'] : ''} />
            <Input value={selectedItem ? selectedItem.size : ''} />
            {/* <Input value={selectedItem.aspectRatio} /> */}
            <Input value={selectedItem ? selectedItem.mimetype : ''} />
            <Input value={selectedItem ? selectedItem.uploaded : ''} />
          </PreviewWrapper>
          {/* )} */}
        </Universe>
        <Actions>
          <ButtonWithIcon icon={upIcon} label="Upload Files" />
          <ButtonWithIcon icon={upIcon} disabled label="Delete Selected" />
        </Actions>
      </U>
    )
  }

  render() {
    const { isOpen, hideModal } = this.props
    const body = this.renderBody()

    return (
      <DialogModal
        headerText="Asset Manager"
        isOpen={isOpen}
        notCentered
        onRequestClose={hideModal}
        showConfirmButton={false}
        size="large"
      >
        {body}
      </DialogModal>
    )
  }
}

export default AssetManager
