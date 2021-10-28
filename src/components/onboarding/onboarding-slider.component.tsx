import * as React from 'react'
import styled from 'styled-components/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { FlatList } from 'react-native-gesture-handler'
import tw from 'tailwind-rn'
import {
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native'

import { SocialDomains } from '@/typings/Requests'
import * as k from '@/utils/constants'

import { useTranslation } from '@/providers'
import { slides, Slide } from '@/static/onboarding-slides.data'
import { useScrollToIndexFailed } from '@/hooks'
import { RemoteImage } from '../remote-image.component'

import { OnboardingSlide as AnimatedSlide } from './onboarding-slide.component'
import { OnboardingAuth as AuthSlide } from './onboarding-auth.component'

import WaveImage from '@/assets/images/onboarding-wave.png'

const SLIDE_COUNT = slides.length
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

interface Props {
  onSocialAuth: (domain: SocialDomains) => void
  onRegister: () => void
  onClose: () => void
  showAuth?: boolean
}

export const OnboardingSlider = ({
  onSocialAuth,
  onRegister,
  onClose,
  showAuth,
}: Props) => {
  const insets = useSafeAreaInsets()
  const i18n = useTranslation()

  const slideRefs = React.useRef<LottieView[]>([])
  const xPosRef = React.useRef(new Animated.Value(0))
  const flatlistRef = React.useRef<FlatList<Slide>>()

  const scrollToIndexFailed = useScrollToIndexFailed(flatlistRef)

  const [selectedIdx, setSelectedIdx] = React.useState(0)

  React.useEffect(() => {
    if (showAuth) {
      flatlistRef.current?.scrollToIndex({
        animated: false,
        index: SLIDE_COUNT - 1,
      })
      setSelectedIdx(slides.length - 1)
    }
  }, [showAuth])

  React.useEffect(() => {
    if (slideRefs.current) {
      slideRefs.current[0].play(0, 46)
    }
  }, [])

  const handleScrollBegin = React.useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(nativeEvent.contentOffset.x / k.screen.w)
      handleEndAnimation(index)
    },
    []
  )

  const handleScrollEnd = React.useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(nativeEvent.contentOffset.x / k.screen.w)
      setSelectedIdx(index)
      handleStartAnimation(index)
    },
    []
  )

  const handleEndAnimation = (index: number) => {
    switch (index) {
      case 0:
        slideRefs.current?.[index].play(46, 103)
        break
      case 1:
        slideRefs.current?.[index].play(57, 104)
        break
      case 2:
        slideRefs.current?.[index].play(63, 114)
        break
      case 3:
        slideRefs.current?.[index].play(46, 106)
        break
    }
  }

  const handleStartAnimation = (index: number) => {
    switch (index) {
      case 0:
        slideRefs.current?.[index].play(0, 46)
        break
      case 1:
        slideRefs.current?.[index].play(0, 57)
        break
      case 2:
        slideRefs.current?.[index].play(0, 63)
        break
      case 3:
        slideRefs.current?.[index].play(0, 46)
        break
    }
  }

  const bgImageWrapperStyle: Animated.AnimatedProps<StyleProp<ViewStyle>> = {
    transform: [
      {
        translateX: xPosRef.current.interpolate({
          inputRange: [0, k.screen.w * SLIDE_COUNT],
          outputRange: [0, -k.screen.w * SLIDE_COUNT],
          extrapolate: 'clamp',
        }),
      },
    ],
  }

  const onScroll = React.useMemo(
    () =>
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: xPosRef.current,
              },
            },
          },
        ],
        { useNativeDriver: true }
      ),
    []
  )

  const renderItem: ListRenderItem<Slide> = React.useCallback(
    ({ item, index }) => {
      const title = `${i18n.t(`onboarding_${index + 1}_title` as never)}`
      const description = `${i18n.t(`onboarding_${index + 1}_text` as never)}`

      return index !== SLIDE_COUNT - 1 ? (
        <AnimatedSlide
          id={item.id}
          ref={r => (slideRefs.current[index] = r as never)}
          animSource={item.animSource}
          {...{ title, description }}
        />
      ) : (
        <AuthSlide
          onDismiss={onClose}
          onSocialAuth={onSocialAuth}
          onShowForm={onRegister}
        />
      )
    },
    [i18n, onClose, onRegister, onSocialAuth]
  )

  const renderFlatlist = React.useMemo(
    () => (
      <FlatListWrapper
        ref={flatlistRef}
        render={renderItem}
        onScroll={onScroll}
        onScrollBegin={handleScrollBegin}
        onScrollEnd={handleScrollEnd}
        onScrollFail={scrollToIndexFailed}
      />
    ),
    []
  )

  return (
    <Wrapper>
      <BackgroundWrapper style={bgImageWrapperStyle}>
        <RemoteImage type="local" source={WaveImage} resizeMode="stretch" />
      </BackgroundWrapper>
      {renderFlatlist}
      <IndicatorWrapper style={{ bottom: insets.bottom }}>
        {slides.map((item, index) => (
          <Indicator key={item.id} selected={index === selectedIdx} />
        ))}
      </IndicatorWrapper>
    </Wrapper>
  )
}

// Wrapped Flatlist in usememo to stop uneccessary
// re-renders from indicator state changes

interface ListProps {
  render: ListRenderItem<any>
  onScroll: any
  onScrollBegin: any
  onScrollEnd: any
  onScrollFail: any
}

const FlatListWrapper = React.forwardRef(
  (
    { render, onScroll, onScrollBegin, onScrollEnd, onScrollFail }: ListProps,
    parentRef
  ) => {
    return React.useMemo(
      () => (
        <AnimatedFlatList
          ref={parentRef}
          data={slides}
          renderItem={render}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={onScroll}
          onScrollBeginDrag={onScrollBegin}
          onMomentumScrollEnd={onScrollEnd}
          onScrollToIndexFailed={onScrollFail}
          removeClippedSubviews
        />
      ),
      [onScroll, onScrollEnd, onScrollFail, render, onScrollBegin, parentRef]
    )
  }
)

const Wrapper = styled.View`
  ${tw(`absolute inset-0`)};
  background-color: #100121;
`
const BackgroundWrapper = styled(Animated.View)`
  ${tw(`absolute`)};
  width: ${k.screen.w * SLIDE_COUNT}px;
  height: ${k.screen.h * 0.8};
`
const IndicatorWrapper = styled.View`
  ${tw(`flex-row h-16 mt-8 w-full items-center justify-center`)}
`
const Indicator = styled.View<{ selected: boolean }>`
  ${tw(`rounded-xl h-2 w-2 bg-white mx-1`)};
  background-color: ${({ selected }) =>
    selected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.25)'};
`
