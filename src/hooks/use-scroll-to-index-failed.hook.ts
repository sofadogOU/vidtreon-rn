import * as React from 'react'

export const useScrollToIndexFailed = (ref: React.MutableRefObject<any>) =>
  React.useCallback((info: { index: number }) => {
    const wait = new Promise(resolve => setTimeout(resolve, 0))
    wait.then(() => {
      ref.current?.scrollToIndex({ index: info.index, animated: true })
    })
  }, [])
