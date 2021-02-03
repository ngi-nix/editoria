import React from 'react'

const withConfig = (Wrapper, editorConfig) => {
  const editorWithConfig = props => (
    <Wrapper {...props} editorConfig={editorConfig} />
  )

  return editorWithConfig
}

export default withConfig
