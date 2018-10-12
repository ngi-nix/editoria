import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import config from 'config'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/css/css'
// import './codemirror.local.css'
import 'codemirror/lib/codemirror.css'
import classes from './PagedStyler.local.scss'

class PagedStyler extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      location: undefined,
      css: undefined,
      changed: undefined,
      shouldRefresh: false,
      random: 0,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handlePrint = this.handlePrint.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
  }

  componentDidMount() {
    const { match } = this.props
    const { params } = match
    axios.get(`/uploads/paged/${params.hashed}/default.css`).then(res => {
      this.setState({ css: res.data, isLoading: false })
    })
  }

  handleChange(doc, change) {
    this.setState({ changed: doc })
  }

  handlePrint(e) {
    e.preventDefault()
    const pri = document.getElementById('printBook').contentWindow
    pri.focus()
    pri.print()
  }

  handleClick(e) {
    e.preventDefault()
    const { match } = this.props
    const { params } = match
    const { hashed } = params
    const { changed } = this.state
    axios
      .post(
        `${
          config['pubsweet-server'].baseUrl
        }/api/pagedStyler/stylesheet/${hashed}/`,
        {
          source: changed,
        },
      )
      .then(res => {
        this.setState({
          shouldRefresh: true,
          random: this.state.random + 1,
        })
      })
  }

  handleDownload(e) {
    e.preventDefault()
    const { match } = this.props
    const { params } = match
    const { hashed } = params
    axios
      .get(
        `${
          config['pubsweet-server'].baseUrl
        }/api/pagedStyler/exportHTML/${hashed}/`,
      )
      .then(res => {
        window.location.replace(res.request.responseURL)
        // console.log('res', res)
      })
  }

  render() {
    const { css } = this.state
    const { match } = this.props
    const { params } = match
    const { hashed } = params

    if (!css) {
      return <p>Loading</p>
    }
    return (
      <div className={classes.container}>
        <div className={classes.codeEditorContainer}>
          <div className={classes.buttonsContainer}>
            <button className={classes.buttonStyler} onClick={this.handleClick}>
              Sync
            </button>
            <button className={classes.buttonStyler} onClick={this.handlePrint}>
              Print
            </button>
            <button
              className={classes.buttonStyler}
              onClick={this.handleDownload}
            >
              Download HTML
            </button>
          </div>
          <CodeMirror
            className={classes.editor}
            onChange={this.handleChange}
            options={{
              mode: 'css',
              lineNumbers: true,
            }}
            value={css}
          />
        </div>
        <iframe
          className={classes.previewerContainer}
          frameBorder="0"
          id="printBook"
          key={this.state.random}
          src={`${
            config['pubsweet-server'].baseUrl
          }/paged/previewer/index.html?url=/uploads/paged/${hashed}/index.html&stylesheet=/uploads/paged/${hashed}/default.css`}
          title="desktop-payment-page"
        />
      </div>
    )
  }
}

PagedStyler.propTypes = {}

export default PagedStyler
