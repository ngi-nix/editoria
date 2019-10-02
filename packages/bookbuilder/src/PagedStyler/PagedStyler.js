import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import 'codemirror/mode/css/css'
import 'codemirror/lib/codemirror.css'
import { Controlled as CodeMirror } from 'react-codemirror2'

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

const handlePrint = e => {
  e.preventDefault()
  const pri = document.getElementById('printBook').contentWindow
  pri.focus()
  pri.print()
}

const handleClick = e => {
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
        random: this.state.random + 1,
      })
    })
}

const handleDownload = hashed => e => {
  e.preventDefault()
  axios.get(`/api/pagedStyler/exportHTML/${hashed}/`).then(res => {
    window.location.replace(res.request.responseURL)
  })
}

const getCssFile = template =>
  template.files.find(file => file.mimetype === 'text/css')

const PagedStyler = ({ hashed, template, onWarningModal }) => {
  const [cssFile, setCssFile] = useState()

  const currentTemplate = getCssFile(template)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/${currentTemplate.source}`)
      const file = await response.text()
      setCssFile(file)
    }
    if (!cssFile) fetchData()
  })

  const random = ''

  return (
    <Wrapper>
      <CodeEditorWrapper>
        <EditorToolbar>
          <Actions onClick={() => onWarningModal(currentTemplate, cssFile)}>
            Save
          </Actions>
          <Actions onClick={handlePrint}>Print</Actions>
          <Actions onClick={handleDownload(hashed)}>Download HTML</Actions>
        </EditorToolbar>
        <EditorArea>
          <CodeMirror
            onBeforeChange={(editor, data, newValue) => {
              setCssFile(newValue)
            }}
            options={{
              mode: 'css',
              lineWrapping: true,
              lineNumbers: true,
              readOnly: false,
            }}
            value={cssFile}
          />
        </EditorArea>
      </CodeEditorWrapper>
      <PreviewArea>
        <iframe
          // className={classes.previewerContainer}
          frameBorder="0"
          id="printBook"
          key={random}
          src={`/paged/previewer/index.html?url=/uploads/paged/${hashed}/index.html&stylesheet=/uploads/paged/${hashed}/default.css`}
          title="PagedJS"
        />
      </PreviewArea>
    </Wrapper>
  )
}

PagedStyler.propTypes = {}

export default PagedStyler
