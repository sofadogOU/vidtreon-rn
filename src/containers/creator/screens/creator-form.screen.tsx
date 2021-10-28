import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import FastImage from 'react-native-fast-image'
import LottieView from 'lottie-react-native'

import * as k from '@/utils/constants'

import { useTranslation } from '@/providers/TranslationProvider'

import { ContactForm, Button } from '@/components'

import WaveImage from '@/assets/images/creator-wave.png'
import CreatorAnim from '@/assets/lottie/creator.json'

export const CreatorFormScreen = () => {
  const i18n = useTranslation()
  const [showForm, setShowForm] = React.useState(false)

  const handleFormClose = () => {
    setShowForm(false)
  }

  const handleContactPress = () => {
    setShowForm(true)
  }

  return (
    <>
      <Container>
        <BGImage source={WaveImage} resizeMode="cover" />
        <LottieWrapper>
          <Lottie
            source={CreatorAnim}
            autoPlay
            loop={false}
            resizeMode="contain"
          />
        </LottieWrapper>
        <ButtonWrapper>
          <Button
            style={{
              paddingHorizontal: k.sizes.sm,
            }}
            onPress={handleContactPress}
          >
            <Button.Label style={{ color: 'white' }}>
              {i18n.t('button_contact')}
            </Button.Label>
          </Button>
        </ButtonWrapper>
      </Container>
      <ContactForm isVisible={showForm} onClose={handleFormClose} />
    </>
  )
}

const Container = styled.View`
  ${tw(`flex-1 items-center justify-center`)};
  background-color: ${({ theme }) => theme.backgroundDarkest};
`
const BGImage = styled(FastImage)`
  ${tw(`absolute inset-0`)};
`
const LottieWrapper = styled.View`
  ${tw(`items-center justify-center`)};
`
const Lottie = styled(LottieView)`
  ${tw(`pb-6`)};
  width: ${k.screen.w * 0.95}px;
`
const ButtonWrapper = styled.View`
  ${tw(`flex-row items-center justify-center px-8`)}
`
