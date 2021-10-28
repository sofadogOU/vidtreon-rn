import theme from '@/themes/light'
type ThemeInterface = typeof theme

declare module 'styled-components' {
  interface DefaultTheme extends ThemeInterface {}
}
