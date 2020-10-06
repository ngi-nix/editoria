import React from 'react'
import { State } from 'react-powerplug'

const statefull = props => {
  const { render } = props

  return (
    <State initial={{ pauseUpdates: false }}>
      {({ state, setState }) => {
        return render({ state, setState })
      }}
    </State>
  )
}

export default statefull
