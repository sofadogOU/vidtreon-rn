import * as React from 'react'
import { StyleProp, TextProps, TextStyle, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import Haptics from 'react-native-haptic-feedback'

import * as k from '@/utils/constants'
import { useTranslation } from '@/providers/TranslationProvider'
import { Icon, IconNamesEnum } from './icon.component'

interface Props extends TextProps {
  children: React.ReactNode
  showAccessory?: boolean
  onAccessoryPress?: () => void
  icon?: IconNamesEnum
  textStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
}

export const SectionTitle = ({
  children,
  onAccessoryPress,
  showAccessory,
  icon,
  textStyle,
  containerStyle,
}: Props) => {
  const i18n = useTranslation()
  const theme = useTheme()

  const handleAccessoryPress = () => {
    Haptics.trigger('impactLight', k.hapticOptions)
    onAccessoryPress?.()
  }
  return (
    <Container style={containerStyle as any}>
      <TextContainer>
        {icon && (
          <IconWrapper>
            <Icon name={icon} size="xs" color={theme.text.body} />
          </IconWrapper>
        )}
        <Title style={textStyle as any}>{children}</Title>
      </TextContainer>
      {onAccessoryPress && (showAccessory === undefined || showAccessory) && (
        <AccessoryBtn onPress={handleAccessoryPress}>
          <AccessoryLabel>{i18n.t('button_view_all')}</AccessoryLabel>
        </AccessoryBtn>
      )}
    </Container>
  )
}

const Container = styled.View`
  ${tw(`px-4 flex-row h-6 items-center justify-between mb-1`)}
`
const TextContainer = styled.View`
  ${tw(`flex-1 flex-row items-center`)}
`
const Title = styled.Text`
  ${tw(`text-base font-semibold`)}
  color: ${({ theme }) => theme.text.body};
`
const AccessoryBtn = styled.TouchableOpacity`
  ${tw(`h-full justify-center items-center rounded-full`)}
`
const AccessoryLabel = styled.Text`
  ${tw(`text-sm font-medium`)};
  color: ${({ theme }) => theme.text.muted};
`
const IconWrapper = styled.View`
  margin-right: 6px;
`
