import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
} from 'react'
import { StatusBar } from 'react-native'
import { ThemeProvider as SCThemeProvider } from 'styled-components/native'
import changeNavigationBarColor from 'react-native-navigation-bar-color'
import {
  Appearance,
  AppearanceProvider,
  ColorSchemeName,
} from 'react-native-appearance'

import lightTheme from '@/themes/light'
import darkTheme from '@/themes/dark'
import { useStore } from '@/hooks'

const defaultMode = Appearance.getColorScheme() || 'light'

interface Context {
  mode: ColorSchemeName
  setMode: (mode: ColorSchemeName) => void
}
const ThemeContext = createContext({} as Context)

interface Props {
  children: (theme: ColorSchemeName) => React.ReactNode
}

const ManageThemeProvider = ({ children }: Props) => {
  const [theme, setTheme] = useState(defaultMode)

  const getUserState = React.useCallback(
    state => ({
      themePreference: state.theme,
    }),
    []
  )

  const { themePreference } = useStore(getUserState)

  useEffect(() => {
    setTheme(themePreference)
  }, [themePreference])

  const setMode = (mode: ColorSchemeName) => setTheme(mode)
  const IS_DARK_THEME = theme === 'dark'

  const context = useMemo(
    () => ({
      mode: theme,
      setMode,
    }),
    [theme]
  )

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) =>
      setTheme(colorScheme)
    )
    return () => {
      subscription.remove()
    }
  }, [])

  useEffect(() => {
    changeNavigationBarColor(
      IS_DARK_THEME ? darkTheme.backgroundDark : lightTheme.backgroundDark,
      IS_DARK_THEME ? false : true,
      true
    )
  }, [theme, IS_DARK_THEME])

  return (
    <ThemeContext.Provider value={context}>
      <SCThemeProvider theme={IS_DARK_THEME ? darkTheme : lightTheme}>
        <>
          <StatusBar
            translucent={true}
            barStyle={IS_DARK_THEME ? 'light-content' : 'dark-content'}
          />
          {children(theme)}
        </>
      </SCThemeProvider>
    </ThemeContext.Provider>
  )
}

const ThemeProvider = ({ children }: Props) => (
  <AppearanceProvider>
    <ManageThemeProvider>{children}</ManageThemeProvider>
  </AppearanceProvider>
)

export const useTheme = () => useContext(ThemeContext)
export default ThemeProvider
