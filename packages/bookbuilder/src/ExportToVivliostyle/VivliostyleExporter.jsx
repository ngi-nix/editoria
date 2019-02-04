import React, { Component } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import config from 'config'
import classes from './VivliostyleExporter.local.scss'
import ErrorModal from './ErrorModal'

class VivliostyleExporter extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedOption: undefined }
    this.handleHTMLToEpub = this.handleHTMLToEpub.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleHTMLToEpub = e => {
    e.preventDefault()
    const { book, htmlToEpub, showModalToggle, history } = this.props
    const { selectedOption } = this.state

    let converter
    if (config['pubsweet-client'] && config['pubsweet-client'].converter) {
      converter = config['pubsweet-client'].converter
    }
    const queryParams = {
      destination: 'folder',
      converter: !converter ? 'default' : `${converter}`,
      previewer: `${selectedOption.value}`,
      style: 'epub.css',
    }
    // console.log('queryPar', queryParams)
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
        console.log('res', res)
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
        showModalToggle()
      })
  }

  toggleModal = () => {
    const { showModalToggle } = this.props
    showModalToggle()
  }

  handleChange = currentValue => {
    this.setState({ selectedOption: currentValue })
  }

  render() {
    const { selectedOption } = this.state
    const { showModal, outerContainer } = this.props
    const options = [
      { value: 'vivliostyle', label: 'Vivliostyle' },
      { value: 'paged', label: 'PagedJS' },
    ]

    let modal

    const customStyles = {
      container: base => ({
        ...base,
        width: 120,
        margin: 0,
        padding: 0,
        fontFamily: 'Fira Sans Condensed',
      }),
      dropdownIndicator: base => ({
        ...base,
        padding: 0,
      }),
      valueContainer: base => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
      }),
      control: base => ({
        ...base,
        borderRadius: 0,
        minHeight: 0,
      }),
    }

    if (showModal) {
      modal = (
        <ErrorModal
          container={outerContainer}
          show={showModal}
          toggle={this.toggleModal}
        />
      )
    }

    return (
      <form
        className={classes.exportBookContainer}
        onSubmit={this.handleHTMLToEpub}
      >
        <label className={classes.exportLabel}>
          <i className={classes.exportToBookIcon} />
          <span className={classes.vivliostyleExportText}>Export Book</span>
        </label>
        <Select
          isClearable={false}
          isSearchable={false}
          onChange={this.handleChange}
          options={options}
          styles={customStyles}
          value={selectedOption}
        />
        <button className={classes.submitBtn} disabled={!selectedOption}>
          Go
        </button>
        {modal}
      </form>
    )
  }
}

VivliostyleExporter.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  htmlToEpub: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  showModalToggle: PropTypes.func.isRequired,
  outerContainer: PropTypes.any.isRequired,
}

export default VivliostyleExporter
