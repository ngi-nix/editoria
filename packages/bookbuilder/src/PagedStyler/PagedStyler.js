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

const handleDownload = hashed => e => {
  e.preventDefault()
  axios.get(`/api/fileserver/paged/${hashed}/index.html`).then(res => {
    window.location.replace(res.request.responseURL)
  })
}

const getCssFile = template =>
  template.files.find(file => file.mimetype === 'text/css')

const PagedStyler = ({
  bookId,
  bookTitle,
  hashed,
  history,
  template,
  onWarningModal,
}) => {
  const [cssFile, setCssFile] = useState()
  const [random, setRandom] = useState('')
  const { id } = template
  const templateFile = getCssFile(template)

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/${templateFile.source}`)
      const file = await response.text()
      setCssFile(file)
    }
    fetchData()
  }, [id])

  return (
    <Wrapper>
      <CodeEditorWrapper>
        <EditorToolbar>
          <Actions
            onClick={() =>
              onWarningModal(
                bookId,
                bookTitle,
                templateFile,
                cssFile,
                template,
                hashed,
                history,
              ).then(() =>
                setRandom(
                  Math.random()
                    .toString(36)
                    .substring(7),
                ),
              )
            }
          >
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
          src={`/paged/previewer/index.html?url=/uploads/paged/${hashed}/index.html&stylesheet=/uploads/paged/${hashed}/${
            getCssFile(template).name
          }`}
          title="PagedJS"
        />
      </PreviewArea>
    </Wrapper>
  )
}

PagedStyler.propTypes = {}

export default PagedStyler
