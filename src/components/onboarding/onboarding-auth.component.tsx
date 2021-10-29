import * as React from 'react'
import { StyleProp,ImageBackground, } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import FastImage, { ImageStyle } from 'react-native-fast-image'

import { SocialDomains } from '@/typings/Requests'
import * as k from '@/utils/constants'

import { useTranslation } from '@/providers'
import { Button } from '../buttons.component'

import LogoImage from '@/assets/images/onboarding-logo.png'
import bgLogo from '@/assets/images/bglogo.png'
import { RemoteImage } from '../remote-image.component'

const buttonStyle = (backgroundColor: string) => ({
  backgroundColor,
  marginBottom: k.sizes.lg,
})

interface Props {
  onDismiss: () => void
  onSocialAuth: (domain: SocialDomains) => void
  onShowForm: () => void
}

export const OnboardingAuth = ({
  onDismiss,
  onSocialAuth,
  onShowForm,
}: Props) => {
  const theme = useTheme()
  const i18n = useTranslation()

  const imageStyle: StyleProp<ImageStyle> = React.useMemo(
    () => ({
      height: Math.max(k.screen.w / 3, 200),
      width: Math.max(k.screen.w / 3, 200),
    }),
    []
  )

  return (
    <>
      {/* <SlideWrapper> */}
      {/* <BackgroundImageWrapper>
      <RemoteImage source={bgLogo} />
      
      </BackgroundImageWrapper> */}
      <ImageBackground source={bgLogo} resizeMode="cover" style={{ flex: 1,paddingBottom:100,
    justifyContent: "center"}}>
    
    
        <SlideContainer>
          <LogoWrapper>

            {/* <FastImage
              style={imageStyle}
              // source={LogoImage as never}
              source={bgLogo as never}

              resizeMode="contain"
            /> */}
          </LogoWrapper>
          <TextContainer>
            {/* <Title>{`${i18n.t('onboarding_5_title')}`}</Title> */}
            <ButtonWrapper>
              {!k.isAndroid && (
                <Button
                  type="social"
                  style={buttonStyle(theme.social.apple)}
                  onPress={() => onSocialAuth('apple')}
                >
                  <Button.Icon name="apple" color="#000000" />
                  <Button.Label style={{ color: '#000000' }}>{`${i18n.t(
                    'button_signin'
                  )} Apple`}</Button.Label>
                </Button>
              )}
              <Button
                type="social"
                style={buttonStyle(theme.social.google)}
                onPress={() => onSocialAuth('google')}
              >
                <Button.Icon name="google" />
                <Button.Label>{`${i18n.t(
                  'button_signin'
                )} Google`}</Button.Label>
              </Button>
              <Button
                type="social"
                style={buttonStyle(theme.social.facebook)}
                onPress={() => onSocialAuth('facebook')}
              >
                <Button.Icon name="facebook" />
                <Button.Label>{`${i18n.t(
                  'button_signin'
                )} Facebook`}</Button.Label>
              </Button>
              <Button
                type="social"
                style={buttonStyle(theme.secondary.tint)}
                onPress={onShowForm}
              >
                <Button.Icon name="email" />
                <Button.Label>{`${i18n.t(
                  'button_signin'
                )} email`}</Button.Label>
              </Button>
            </ButtonWrapper>
            {/* <SkipButton onPress={() => onDismiss()}>
              <SkipLabel>{`${i18n.t('button_skip')}`}</SkipLabel>
            </SkipButton> */}
          </TextContainer>
        </SlideContainer>
        </ImageBackground>
      {/* </SlideWrapper> */}
    </>
  )
}

const SlideWrapper = styled.SafeAreaView`
  width: ${k.screen.w}px;
`
const SlideContainer = styled.View`
  ${tw(`flex-1 items-center `)}
`
const TextContainer = styled.View`
  ${tw(`w-full items-center justify-center`)}
`
const Title = styled.Text`
  ${tw(`text-white font-thin text-center mb-4`)};
  font-size: 40px;
  letter-spacing: 1px;
`
const LogoWrapper = styled.View`
  ${tw(`items-center justify-center flex-1`)}
`
const BackgroundImageWrapper = styled.View`
  ${tw(`absolute inset-0 rounded-xl overflow-hidden`)}
`
const ButtonWrapper = styled.View`
  ${tw(`justify-center`)}
  width: ${Math.max(k.screen.w / 1.5, 265)}px;
`
const SkipButton = styled.TouchableOpacity`
  ${tw(
    `border border-white rounded-md h-8 mt-4
    items-center justify-center px-2 border-opacity-75`
  )};
`
const SkipLabel = styled.Text`
  ${tw(`text-white text-sm text-opacity-75`)};
`
