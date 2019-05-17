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
  height: calc(3.5 * ${th('gridUnit')});
  margin: 0 ${th('gridUnit')} 0 0;
  padding: 0;
  svg {
    fill: #828282;
  }
  width: calc(3.5 * ${th('gridUnit')});
`
const Label = styled.div`
  font-size: ${th('fontSizeBase')};
  margin: 0 ${th('gridUnit')} 0 0;
  line-height: ${th('lineHeightBase')};
  color: #828282;
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
        onError(
          'It seems like one or more of your book components (chapters, parts, generic components, etc.) does not have content!',
        )
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
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Common/Icon/Book-v1">
          <rect width="28" height="28" fill="white" />
          <g id="Common/Icon-background">
            <rect width="28" height="28" fill="white" />
          </g>
          <g id="Vector">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22 20.4V8.60176L19.7739 7.9211C18.3121 7.47413 16.7874 7.49408 15.333 7.97922L13.4667 8.60176V20.4L15.0826 19.861C16.7014 19.321 18.3985 19.2988 20.0255 19.7963L22 20.4ZM20.9333 19.12V9.68141L19.2638 9.13688C18.1674 8.7793 17.0239 8.79527 15.9331 9.18338L14.5333 9.68141V19.12L15.7453 18.6888C16.9594 18.2568 18.2322 18.239 19.4525 18.637L20.9333 19.12Z"
              fill="#828282"
            />
            <path
              d="M13.4667 20.4V8.60176C11.76 7.26984 9.02199 7.63177 7.86632 7.97922L6 8.60176V20.4L7.61597 19.861C8.67731 19.5073 11.3333 19.12 13.4667 20.4Z"
              fill="#828282"
            />
          </g>
        </g>
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
