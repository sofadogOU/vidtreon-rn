import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import LottieView from 'lottie-react-native'

import { Slide } from '@/static/onboarding-slides.data'
import * as k from '@/utils/constants'

const ANIM_SIZE = k.screen.w

export const OnboardingSlide = React.forwardRef<LottieView, Slide>(
  ({ animSource, title, description }: Slide, parentRef) => {
    const lottieStyle = React.useMemo(
      () => ({ width: '100%', height: '100%' }),
      []
    )
    return (
      <SlideWrapper>
        <SlideContainer>
          <AnimWrapper>
            <LottieView
              style={lottieStyle}
              ref={parentRef}
              source={animSource as string}
              loop={false}
            />
          </AnimWrapper>
          <TextContainer>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </TextContainer>
        </SlideContainer>
      </SlideWrapper>
    )
  }
)

const SlideWrapper = styled.SafeAreaView`
  width: ${k.screen.w}px;
`
const SlideContainer = styled.View`
  ${tw(`flex-1 items-center`)}
`
const AnimWrapper = styled.View`
  width: ${ANIM_SIZE}px;
  height: ${ANIM_SIZE}px;
`
const TextContainer = styled.View`
  ${tw(`w-full flex-1 items-center justify-center`)}
`
const Title = styled.Text`
  ${tw(`text-white font-thin text-center`)};
  font-size: 40px;
  letter-spacing: 1px;
`
const Description = styled.Text`
  ${tw(`text-white text-base text-center mt-4 px-11`)}
`
