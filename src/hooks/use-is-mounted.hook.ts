/* https://gist.github.com/jaydenseric/a67cfb1b809b1b789daa17dfe6f83daa */

import React from 'react'

export const useIsMounted = () => {
  const ref = React.useRef(false)
  const [, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    ref.current = true
    setIsMounted(true)
    return () => {
      ref.current = false
    }
  }, [])
  const checker = React.useCallback((): boolean => {
    return ref.current
  }, [])
  return checker
}
