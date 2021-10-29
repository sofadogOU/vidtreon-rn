import React from 'react'
import { StyleProp, StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import LottieView from 'lottie-react-native'
import { LinearGradient } from 'expo-linear-gradient'
import FastImage, { ImageStyle } from 'react-native-fast-image'
import { MotiView } from 'moti'

import * as k from '@/utils/constants'

import MotifImg from '@/assets/images/motif.png'
import SpinnerAnimation from '@/assets/lottie/spinner.json'

const SPINNER_SIZE = k.screen.w / 2

interface Props {
  hide: boolean
  onAnimationEnd?: (isFinished: boolean) => void
}

export const SplashScreen = ({ hide = false, onAnimationEnd }: Props) => {
  const theme = useTheme()

  const [isLoaded, setLoaded] = React.useState(false)

  const lottieStyle = React.useMemo(
    () => ({
      width: SPINNER_SIZE,
      height: SPINNER_SIZE,
    }),
    []
  )

  const renderSpinner = React.useMemo(() => {
    return (
      <LottieView style={lottieStyle} source={SpinnerAnimation} autoPlay loop />
    )
  }, [lottieStyle])

  const bgImageStyle: StyleProp<ImageStyle> = React.useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
    }),
    []
  )

  const gradient = [
    theme.primaryGradient.stop1,
    theme.primaryGradient.stop2,
    theme.primaryGradient.stop3,
  ]

  const handleLoaded = React.useCallback(() => {
    setLoaded(true)
  }, [])

  const handleAnimationEnd = (_: string, isFinished: boolean) => {
    hide && onAnimationEnd?.(isFinished)
  }

  return (
  null
    // <AnimatedWrapper
    //   animate={{ opacity: hide ? 0 : 1 }}
    //   transition={{ type: 'timing', duration: 200 }}
    //   onDidAnimate={handleAnimationEnd}
    // >
    //   <GradientWrapper colors={gradient}>
    //     {/* <AnimatedContainer
    //       animate={{ opacity: isLoaded ? 1 : 0 }}
    //       transition={{
    //         type: 'timing',
    //         duration: 500,
    //         delay: 250,
    //       }}
    //     > */}
    //       <FastImage
    //         style={bgImageStyle}
    //         source={MotifImg}
    //         resizeMode="cover"
    //         onLoad={handleLoaded}
    //       />
    //       {renderSpinner}
    //     {/* </AnimatedContainer> */}
    //   </GradientWrapper>
    // </AnimatedWrapper>
  )
}

const AnimatedWrapper = styled(MotiView)`
  ${tw(`absolute inset-0`)}
`
const GradientWrapper = styled(LinearGradient)`
  ${tw(`w-full h-full items-center justify-center`)}
`
const AnimatedContainer = styled(MotiView)`
  ${tw(`w-full h-full items-center justify-center`)}
`
