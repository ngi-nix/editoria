import React, { Component } from 'react'
import Select from 'react-select'
import config from 'config'
import ErrorModal from './ErrorModal'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import { DefaultButton } from './Button'

const Form = styled.form`
  display: flex;
  align-items: center;
`
const Icon = styled.span`
  height: calc(3 * ${th('gridUnit')});
  margin: 0 ${th('gridUnit')} 0 0;
  padding: 0;
  width: calc(3 * ${th('gridUnit')});
`
const Label = styled.div`
  font-size: ${th('fontSizeBase')};
  margin: 0 ${th('gridUnit')} 0 0;
  line-height: ${th('lineHeightBase')};
`
class VivliostyleExporter extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedOption: undefined }
    this.handleHTMLToEpub = this.handleHTMLToEpub.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleHTMLToEpub = e => {
    e.preventDefault()
    const { book, htmlToEpub, history, onError } = this.props
    const { selectedOption } = this.state
    let converter

    if (config['pubsweet-client'] && config['pubsweet-client'].converter) {
      converter = config['pubsweet-client'].converter
    }

    htmlToEpub({
      variables: {
        bookId: book.id,
        destination: 'folder',
        converter: !converter ? 'default' : `${converter}`,
        previewer: `${selectedOption.value}`,
        style: 'epub.css',
      },
    })
      .then(res => {
        const { data } = res
        const { exportBook } = data
        let url
        if (selectedOption.value === 'vivliostyle') {
          const viliostylePath = '/vivliostyle/viewer/vivliostyle-viewer.html'
          url = `${viliostylePath}#b=/uploads/${exportBook}`
          window.open(url, '_blank')
        } else {
          const pagedPath = '/paged/previewer/index.html'
          const stylePath = `/uploads/${exportBook}/default.css`
          url = `${pagedPath}?url=/uploads/${exportBook}/index.html&stylesheet=${stylePath}`
          history.push(`/books/${book.id}/pagedPreviewer/${exportBook}`)
        }
      })
      .catch(error => {
        console.error('er', error)
        onError(error)
      })
  }


  handleChange = currentValue => {
    this.setState({ selectedOption: currentValue })
  }

  render() {
    const { selectedOption } = this.state
    const options = [
      { value: 'vivliostyle', label: 'Vivliostyle' },
      { value: 'paged', label: 'PagedJS' },
    ]

    let modal
    const label = 'Export Book'
    const icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    )
    const customStyles = {
      container: (base, state) => ({
        ...base,
        width: 120,
        margin: '0 8px 0 0',
        padding: 0,
        fontFamily: 'Fira Sans Condensed',
      }),
      control: (base, state) => {
        return {
          ...base,
          borderRadius: 0,
          boxShadow: state.isFocused ? 0 : 0,
          minHeight: 0,
          borderColor: state.isFocused ? th('colorText') : th('colorText'),
          '&:hover': {
            borderColor: state.isFocused ? th('colorText') : th('colorText'),
          },
        }
      },
      dropdownIndicator: base => ({
        ...base,
        padding: 0,
      }),
      valueContainer: base => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
      }),
    }

    return (
      <Form onSubmit={this.handleHTMLToEpub}>
        <Icon>{icon}</Icon>
        <Label>{label.toUpperCase()}</Label>
        <Select
          isClearable={false}
          isSearchable={false}
          onChange={this.handleChange}
          options={options}
          styles={customStyles}
          value={selectedOption}
        />
        <DefaultButton label="go" />
        {modal}
      </Form>
    )
  }
}

export default VivliostyleExporter
