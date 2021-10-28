import * as React from 'react'
import { render, RenderOptions } from '@testing-library/react-native'

import {
  NetworkProvider,
  LocalStateProvider,
  AuthProvider,
  ThemeProvider,
  TranslationProvider,
} from '@/providers'

interface Props {
  children: React.ReactNode
}
const AllTheProviders = ({ children }: Props) => {
  return (
    <NetworkProvider>
      <LocalStateProvider>
        <AuthProvider>
          <ThemeProvider>
            <TranslationProvider>{children}</TranslationProvider>
          </ThemeProvider>
        </AuthProvider>
      </LocalStateProvider>
    </NetworkProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react-native'
// override render method
export { customRender as render }
