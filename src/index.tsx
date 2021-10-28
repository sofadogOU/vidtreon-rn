import 'react-native-gesture-handler'
import * as React from 'react'
import * as Sentry from '@sentry/react-native'
import { NavigationContainer, Theme } from '@react-navigation/native'
import { ColorSchemeName } from 'react-native-appearance'
import { QueryClientProvider, QueryClient } from 'react-query'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import RNBootSplash from 'react-native-bootsplash'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'

import { ThemeProvider, TranslationProvider } from '@/providers'

import { GradientWrapper } from '@/components'

import { AppNavigator } from '@/routes'

import darkTheme from '@/themes/dark'
import lightTheme from '@/themes/light'

const queryClient = new QueryClient()

if (!__DEV__) {
  Sentry.init({
    dsn: 'https://9e394ad995f64e86b4a09c02d6e4bc39@o150639.ingest.sentry.io/5542379',
    release: 'so.fa.dog@3.2.0',
  })
}

const App = () => {
  const configNavTheme = React.useCallback((theme: ColorSchemeName): Theme => {
    return {
      // @ts-ignore
      colors: {
        background:
          theme === 'dark' ? darkTheme.background : lightTheme.background,
      },
    }
  }, [])

  const handleNavReady = () => {
    RNBootSplash.hide()
  }

  return React.useMemo(
    () => (
      <ThemeProvider>
        {(theme: ColorSchemeName) => (
          <GradientWrapper>
            <TranslationProvider>
              <SafeAreaProvider>
                <BottomSheetModalProvider>
                  <NavigationContainer
                    theme={configNavTheme(theme)}
                    onReady={handleNavReady}
                  >
                    <QueryClientProvider client={queryClient}>
                      <AppNavigator />
                    </QueryClientProvider>
                  </NavigationContainer>
                </BottomSheetModalProvider>
              </SafeAreaProvider>
            </TranslationProvider>
          </GradientWrapper>
        )}
      </ThemeProvider>
    ),
    [configNavTheme]
  )
}

export default App
