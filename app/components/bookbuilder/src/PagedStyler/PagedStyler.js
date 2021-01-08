import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { grid } from '@pubsweet/ui-toolkit'
import 'codemirror/mode/css/css'
import 'codemirror/lib/codemirror.css'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { Button, NavBarLink } from '../../../../ui'

const Wrapper = styled.div`
  align-items: flex-start;
  display: flex;
  height: 100%;
  justify-content: flex-start;
  padding: 8px;
`
const CodeEditorWrapper = styled.div`
  display: flex;
  flex-basis: 100%;
  flex-direction: column;
  height: 100%;
  max-width: 50%;
  width: 50%;
`
const EditorToolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  > button:not(:last-child) {
    margin-right: ${grid(1)};
  }
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
  height: 100%;
  max-width: 50%;
  width: 50%;
  iframe {
    height: 100%;
    width: 100%;
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
  previewerLink,
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
      const response = await fetch(
        `/uploads/paged/${hashed}/${templateFile.name}.${templateFile.extension}`,
      )
      const file = await response.text()
      setCssFile(file)
    }
    fetchData()
  }, [hashed, id])

  return (
    <Wrapper>
      <CodeEditorWrapper>
        <EditorToolbar>
          <Button
            label="Save"
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
            title="Save"
          />
          <Button label="Print" onClick={handlePrint} title="Print" />
          <Button
            label="Download HTML"
            onClick={handleDownload(hashed)}
            title="Download HTML"
          />
          <NavBarLink to={`/books/${bookId}/book-builder`}>
            Back to book
          </NavBarLink>
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
          frameBorder="0"
          id="printBook"
          key={random}
          src={previewerLink}
          title="PagedJS"
        />
      </PreviewArea>
    </Wrapper>
  )
}

PagedStyler.propTypes = {}

export default PagedStyler
