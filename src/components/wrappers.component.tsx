import * as React from 'react'
import { ViewProps, ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { LinearGradient } from 'expo-linear-gradient'
// import { ScrollView as RNGHScrollView } from 'react-native-gesture-handler'

import * as k from '@/utils/constants'

interface Props extends ViewProps {
  children: React.ReactNode
}

interface SafeWrapperProps extends Props {
  fill?: boolean
  refreshControl?: any
}

export const GradientWrapper = ({ children, ...rest }: Props) => {
  const theme = useTheme()
  const gradient = [
    theme.primaryGradient.stop1,
    theme.primaryGradient.stop2,
    theme.primaryGradient.stop3,
  ]
  return (
    <LGWrapper colors={gradient}>
      <GradientWrapperView {...{ rest }}>{children}</GradientWrapperView>
    </LGWrapper>
  )
}

export const Wrapper = ({ children, ...rest }: Props) => (
  <WrapperView {...(rest as unknown)}>{children}</WrapperView>
)

export const InlineWrapper = ({ children, ...rest }: Props) => (
  <InlineWrapperView {...(rest as any)}>{children}</InlineWrapperView>
)

export const SafeWrapper = ({
  children,
  fill,
  refreshControl,
  ...rest
}: SafeWrapperProps) => {
  const fillStyle = { height: fill ? '100%' : 'auto' }
  return (
    <WrapperView style={fillStyle as any} {...rest}>
      <WrappedScrollView
        contentContainerStyle={fillStyle}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        <SafeWrapperView>{children}</SafeWrapperView>
      </WrappedScrollView>
    </WrapperView>
  )
}

const GradientWrapperView = styled.View`
  ${tw(`w-full h-full bg-transparent`)}
`
const WrapperView = styled.View`
  ${tw(`flex-1 justify-center items-center`)};
`
const InlineWrapperView = styled.View`
  ${tw(`justify-center items-center`)};
`
const SafeWrapperView = styled.SafeAreaView`
  ${tw(`w-full h-full`)}
  padding-top: ${k.isAndroid ? k.sizes.defPadding : 0}px;
`
const WrappedScrollView = styled(ScrollView)`
  ${tw(`w-full h-full`)}
`
const LGWrapper = styled(LinearGradient)`
  ${tw(`w-full h-full`)}
`
