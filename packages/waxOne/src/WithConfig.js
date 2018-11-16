import React from 'react'

const withConfig = (Wrapper, config) => {
  const editorWithConfig = (props) => (
    <Wrapper {...props} config={config} />
  )

  return editorWithConfig
}

export default withConfig
