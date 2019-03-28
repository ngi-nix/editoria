import React, { Component } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import 'codemirror/mode/css/css'
import 'codemirror/lib/codemirror.css'
import { UnControlled as CodeMirror } from 'react-codemirror2'

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  height: 100%;
  justify-content: flex-start;
  padding: 8px;
`
const CodeEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 50%;
  width: 50%;
  flex-basis: 100%;
  height: 100%;
`
const EditorToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 5%;
`
const Actions = styled.button`
  background: none;
  color: #0d78f2;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  margin-right: 20px;
`
const EditorArea = styled.div`
  flex-grow: 1;
  height: 95%;
  .react-codemirror2 {
    height: 100%;
    .CodeMirror {
      height: 100%;
    }
  }
`
const PreviewArea = styled.div`
  max-width: 50%;
  width: 50%;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
  }
`
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

  handleChange(editor, data, value) {
    this.setState({ changed: value })
  }

  /* eslint-disable */
  handlePrint(e) {
    e.preventDefault()
    const pri = document.getElementById('printBook').contentWindow
    pri.focus()
    pri.print()
  }
  /* eslint-enable */

  handleClick(e) {
    e.preventDefault()
    const { match } = this.props
    const { params } = match
    const { hashed } = params
    const { changed } = this.state
    axios
      .post(`/api/pagedStyler/stylesheet/${hashed}/`, {
        source: changed,
      })
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
    axios.get(`/api/pagedStyler/exportHTML/${hashed}/`).then(res => {
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
      <Wrapper>
        <CodeEditorWrapper>
          <EditorToolbar>
            <Actions onClick={this.handleClick}>Sync</Actions>
            <Actions onClick={this.handlePrint}>Print</Actions>
            <Actions onClick={this.handleDownload}>Download HTML</Actions>
          </EditorToolbar>
          <EditorArea>
            <CodeMirror
              // className={classes.editor}
              onChange={this.handleChange}
              options={{
                mode: 'css',
                lineWrapping: true,
                lineNumbers: true,
                readOnly: false,
              }}
              value={css}
            />
          </EditorArea>
        </CodeEditorWrapper>
        <PreviewArea>
          <iframe
            // className={classes.previewerContainer}
            frameBorder="0"
            id="printBook"
            key={this.state.random}
            src={`/paged/previewer/index.html?url=/uploads/paged/${hashed}/index.html&stylesheet=/uploads/paged/${hashed}/default.css`}
            title="PagedJS"
          />
        </PreviewArea>
      </Wrapper>
    )
  }
}

PagedStyler.propTypes = {}

export default PagedStyler
