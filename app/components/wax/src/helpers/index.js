import { useEffect, useRef } from 'react'

const usePrevious = value => {
  const initial = useRef()
  useEffect(() => {
    initial.current = value
  })
  return initial.current
}

export default usePrevious
