/**
 * https://github.com/amrlabib/react-native-appstate-hook
 */

import { useState, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

interface Params {
  onChange?: (appState: AppStateStatus) => void
  onForeground?: () => void
  onBackground?: () => void
}

export const useAppState = (settings: Params) => {
  const { onChange, onForeground, onBackground } = settings || {}
  const [appState, setAppState] = useState(AppState.currentState)

  useEffect(() => {
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === 'active' && appState !== 'active') {
        isValidFunction(onForeground) && onForeground?.()
      } else if (
        appState === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        isValidFunction(onBackground) && onBackground?.()
      }
      setAppState(nextAppState)
      isValidFunction(onChange) && onChange?.(nextAppState)
    }
    AppState.addEventListener('change', handleAppStateChange)

    return () => AppState.removeEventListener('change', handleAppStateChange)
  }, [onChange, onForeground, onBackground, appState])

  // settings validation
  function isValidFunction(func: unknown) {
    return func && typeof func === 'function'
  }
  return { appState }
}
