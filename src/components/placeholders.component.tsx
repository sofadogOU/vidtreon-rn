import * as React from 'react'
import ContentLoader, { Rect } from 'react-content-loader/native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { MotiView } from 'moti'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'

import * as k from '@/utils/constants'

interface Props {
  animate: boolean
}

export const Placeholder = React.memo(
  ({ animate }: Props) => {
    const theme = useTheme()
    return (
      <ContentLoader
        height="100%"
        width="100%"
        viewBox="0 0 10 10"
        preserveAspectRatio="none"
        animate={animate}
        backgroundColor={theme.backgroundAlt}
        foregroundColor={theme.background}
      >
        <Rect width="100%" height="100%" />
      </ContentLoader>
    )
  },
  () => true
)

export const FeaturedPlaceholder = React.memo(
  () => {
    const theme = useTheme()
    return (
      <ContentLoader
        height="100%"
        width="100%"
        viewBox="0 0 10 10"
        animate
        preserveAspectRatio="none"
        backgroundColor={theme.backgroundAlt}
        foregroundColor={theme.background}
      >
        <Rect x="0" y="0" rx="0.2" ry="0.2" width="100%" height="2" />
        <Rect x="0" y="3.5" rx="0.2" ry="0.2" width="100%" height="1" />
        <Rect x="0" y="5.5" rx="0.2" ry="0.2" width="100%" height="1" />
        <Rect x="20%" y="7.5" rx="0.2" ry="0.2" width="60%" height="1" />
        {/* <Rect x="0" y="6" rx="0.2" ry="0.2" width="100%" height="1" /> */}
      </ContentLoader>
    )
  },
  () => true
)

export const LinePlaceholder = React.memo(
  () => {
    const theme = useTheme()
    return !k.isAndroid ? (
      <ContentLoader
        height="100%"
        width="100%"
        viewBox="0 0 10 10"
        animate
        preserveAspectRatio="none"
        backgroundColor={theme.backgroundAlt}
        foregroundColor={theme.background}
      >
        <Rect x="0" y="0" rx="0.2" ry="0.2" width="100%" height="4" />
      </ContentLoader>
    ) : null
  },
  () => true
)

export const TextPlaceholder = React.memo(
  () => {
    const theme = useTheme()
    return (
      <ContentLoader
        height="100%"
        width="100%"
        viewBox="0 0 10 10"
        animate
        preserveAspectRatio="none"
        backgroundColor={theme.backgroundAlt}
        foregroundColor={theme.background}
      >
        <Rect x="0" y="0" rx="0.2" ry="0.2" width="100%" height="2" />
        <Rect x="0" y="3.5" rx="0.2" ry="0.2" width="100%" height="2" />
        <Rect x="0" y="7" rx="0.2" ry="0.2" width="60%" height="2" />
      </ContentLoader>
    )
  },
  () => true
)

interface AnimatedProps {
  hide?: boolean
  children?: React.ReactNode
}

const AnimatedPlaceholderWrapper = ({ hide, children }: AnimatedProps) => {
  const [isHidden, setHidden] = React.useState(false)
  const [remove, setRemove] = React.useState(false)

  React.useEffect(() => {
    if (typeof hide === 'boolean') {
      setHidden(hide)
    }
  }, [hide])

  const containerStyle: StyleProp<ViewStyle> = React.useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
    }),
    []
  )

  const handleLoaded = React.useCallback(
    (_: string, isFinished: boolean) => {
      if (isFinished && isHidden) {
        setRemove(true)
      }
    },
    [isHidden]
  )

  return !remove ? (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'timing',
        duration: k.isAndroid ? 0 : 300,
      }}
      onDidAnimate={handleLoaded}
      style={containerStyle}
    >
      {children}
    </MotiView>
  ) : null
}

export const AnimatedPlaceholder = ({ hide }: Pick<AnimatedProps, 'hide'>) => {
  return k.isAndroid ? (
    !hide ? (
      <AndroidPlaceholder />
    ) : null
  ) : (
    <AnimatedPlaceholderWrapper hide={hide}>
      <Placeholder animate={true} />
    </AnimatedPlaceholderWrapper>
  )
}

const AndroidPlaceholder = styled.View`
  ${tw(`absolute inset-0`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
