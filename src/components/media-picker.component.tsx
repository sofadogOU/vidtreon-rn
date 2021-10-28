import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { View as MotiView } from 'moti'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  launchCamera,
  launchImageLibrary,
  ImagePickerResponse,
  PhotoQuality,
  AndroidVideoOptions,
  iOSVideoOptions,
} from 'react-native-image-picker'

import * as k from '@/utils/constants'
import { useTranslation } from '@/providers'
import { Icon } from './icon.component'

type AllowedMediaTypes = 'all' | 'image' | 'video'

interface Props {
  isVisible: boolean
  onClose: () => void
  onPick: (data: ImagePickerResponse) => void
  type?: AllowedMediaTypes
}

export const MediaPicker = ({
  isVisible,
  onClose,
  onPick,
  type = 'all',
}: Props) => {
  const i18n = useTranslation()
  const insets = useSafeAreaInsets()

  const [isShowing, setShowing] = React.useState(isVisible)
  const [response, setResponse] = React.useState<ImagePickerResponse>()

  const mediaOptions = React.useMemo(
    () => ({
      maxWidth: 600,
      maxHeight: 600,
      quality: 0.5 as PhotoQuality,
      videoQuality: 'low' as AndroidVideoOptions | iOSVideoOptions,
    }),
    []
  )

  React.useEffect(() => setShowing(isVisible), [isVisible])

  React.useEffect(() => {
    if (response?.didCancel || response?.errorCode) {
      return
    } else if (response) {
      onPick(response)
      handleClose()
    }
  }, [response])

  const handleClose = () => {
    setShowing(false)
  }

  const handleAnimateEnd = (_: unknown, isFinished: boolean) => {
    if (isFinished && !isShowing) {
      onClose()
    }
  }

  const handleTakePicture = React.useCallback(() => {
    launchCamera({ mediaType: 'photo', ...mediaOptions }, setResponse)
  }, [mediaOptions])

  const handleTakeVideo = React.useCallback(() => {
    launchCamera(
      { mediaType: 'video', durationLimit: 60, ...mediaOptions },
      setResponse
    )
  }, [mediaOptions])

  const handlePickMedia = React.useCallback(() => {
    launchImageLibrary({ mediaType: 'mixed', ...mediaOptions }, setResponse)
  }, [mediaOptions])

  return (
    <Wrapper
      animate={{ opacity: isShowing ? 1 : 0 }}
      transition={{ type: 'timing', duration: 200 }}
      onDidAnimate={handleAnimateEnd}
      pointerEvents={isShowing ? 'auto' : 'none'}
    >
      <SafeWrapper
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Container>
          <TitleWrapper>
            <CloseButton onPress={handleClose}>
              <Icon name="closeCircle" />
            </CloseButton>
            <Title>{i18n.t('media_title')}</Title>
          </TitleWrapper>
          <PageWrapper>
            <IntroTitle>{i18n.t('permissions_title')}</IntroTitle>
            <IntroText>{i18n.t('permissions_description')}</IntroText>
            <TwoColWrapper>
              <Button onPress={handleTakePicture}>
                <Icon name="image" size="lg" />
                <Label>{i18n.t('media_button_1')}</Label>
              </Button>
              {(type === 'all' || type === 'video') && (
                <Button onPress={handleTakeVideo}>
                  <Icon name="video" size="lg" />
                  <Label>{i18n.t('media_button_2')}</Label>
                </Button>
              )}
            </TwoColWrapper>
            <Button onPress={handlePickMedia}>
              <Icon name="media" size="lg" />
              <Label>{i18n.t('media_button_3')}</Label>
            </Button>
          </PageWrapper>
        </Container>
      </SafeWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(MotiView)`
  ${tw(`absolute bg-black inset-0`)};
  width: ${k.screen.w}px;
`
const SafeWrapper = styled.View`
  ${tw(`flex-1`)}
`
const Container = styled.View`
  ${tw(`flex-1`)}
`
const TitleWrapper = styled.View`
  ${tw(`h-11 flex-row justify-center items-center`)}
`
const Title = styled.Text`
  ${tw(`text-base text-white font-semibold`)}
`
const CloseButton = styled.TouchableOpacity`
  ${tw(`absolute right-4 h-11 w-11 items-center justify-center`)}
`
const PageWrapper = styled.View`
  ${tw(`flex-1 p-6 justify-center items-center`)}
`
const TwoColWrapper = styled.View`
  ${tw(`flex-row w-full justify-center`)}
`
const IntroTitle = styled.Text`
  ${tw(`text-base font-semibold text-white mb-2`)}
`
const IntroText = styled.Text`
  ${tw(`px-4 text-sm text-white text-center mb-8 text-center px-6`)}
`
const BoldText = styled.Text`
  ${tw(`font-bold`)}
`
const Button = styled.TouchableOpacity`
  ${tw(
    `p-4 m-4 bg-white bg-opacity-25 rounded-lg items-center justify-center`
  )};
  width: 120px;
  height: 120px;
`
const Label = styled.Text`
  ${tw(`text-white text-center mt-2`)}
`
