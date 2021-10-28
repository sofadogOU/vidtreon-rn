import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import FastImage from 'react-native-fast-image'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { LanguageKeys } from '@/typings'

import { useTranslation } from '@/providers/TranslationProvider'

import { Placeholder } from '../placeholders.component'
import { Icon } from '../icon.component'

import EN_US from '@/assets/flags/united-states.png'
import EE from '@/assets/flags/estonia.png'
import PT_BR from '@/assets/flags/brazil.png'

interface Props {
  code: LanguageKeys
  lang: string
}

const mapFlag = (code: LanguageKeys) => {
  switch (code) {
    case 'en':
      return EN_US
    case 'en-EE':
      return EE
    case 'pt-BR':
      return PT_BR
  }
}

export const LanguageItem = ({ code, lang }: Props) => {
  const [flagLoading, setFlagLoading] = React.useState(true)
  const i18n = useTranslation()
  const isSelected = i18n.locale === code

  const renderFlag = React.useMemo(() => {
    const source = mapFlag(code)
    const handleLoaded = () => setFlagLoading(false)
    return (
      <FlagImage source={source} resizeMode="cover" onLoad={handleLoaded} />
    )
  }, [code])

  const handleItemPress = () => {
    i18n.setLocale(code)
  }

  return (
    <TouchableWithoutFeedback onPress={handleItemPress}>
      <Wrapper>
        <Container>
          <LeftWrapper>
            <FlagWrapper>
              <Placeholder animate={flagLoading} />
              {renderFlag}
            </FlagWrapper>
            <Label numberOfLines={1} ellipsizeMode="tail">
              {lang}
            </Label>
          </LeftWrapper>
          {isSelected && (
            <IndicatorWrapper>
              <Icon name="tick" size={18} />
            </IndicatorWrapper>
          )}
        </Container>
      </Wrapper>
    </TouchableWithoutFeedback>
  )
}

const Wrapper = styled.View`
  ${tw(`px-4 py-2 flex-1 items-center flex-row`)}
`
const Container = styled.View`
  ${tw(`p-4 flex-1 items-center flex-row rounded-xl`)};
  elevation: 3;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  background-color: ${({ theme }) => theme.raisedBg};
`
const Label = styled.Text`
  ${tw(`text-base font-medium flex-initial flex-shrink`)};
  color: ${({ theme }) => theme.text.body};
`
const FlagWrapper = styled.View`
  ${tw(`h-10 w-10 rounded-full overflow-hidden mr-3`)}
`
const FlagImage = styled(FastImage)`
  ${tw(`absolute w-full h-full`)};
`
const LeftWrapper = styled.View`
  ${tw(`flex-1 flex-row items-center`)}
`
const IndicatorWrapper = styled.View`
  ${tw(`h-8 w-8 rounded-full overflow-hidden items-center justify-center`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
