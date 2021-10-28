// import 'expo-linear-gradient'

declare module 'expo-linear-gradient' {
  declare type LinearGradientProps = {
    colors: string[]
    children?: any
    start?: number[] | Record<string, number>
    end?: number[] | Record<string, number>
    locations?: number[]
  }
  export declare function LinearGradient({
    colors,
    // locations,
    // start,
    // end,
    children,
    ...props
  }: LinearGradientProps): React.ReactElement
}
