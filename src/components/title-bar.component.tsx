import React from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import * as k from '@/utils/constants'
import { Icon } from './icon.component'

interface Props {
  title: string
  actionTitle?: string
  actionEnabled?: boolean
  onBackPress?: () => void
  onActionPress?: () => void
}

export const TitleBar = ({
  title,
  actionTitle,
  actionEnabled,
  onBackPress,
  onActionPress,
}: Props) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  const containerStyle: StyleProp<ViewStyle> = {
    paddingTop: k.isAndroid ? 0 : insets.top,
    height: k.isAndroid ? 60 : insets.top > 20 ? insets.top + 60 : 74,
  }

  return (
    <>
      <Spacer style={containerStyle as any} />
      <Container style={containerStyle as any}>
        {onBackPress && (
          <HeaderButton onPress={onBackPress}>
            <Icon name="backArrow" size="sm" color={theme.text.body} />
          </HeaderButton>
        )}
        <Title>{title}</Title>
        {onActionPress && actionTitle && (
          <ActionButton
            onPress={onActionPress}
            disabled={actionEnabled !== undefined && actionEnabled !== true}
            isDisabled={actionEnabled !== undefined && actionEnabled !== true}
          >
            <ActionLabel
              isDisabled={actionEnabled !== undefined && actionEnabled !== true}
            >
              {actionTitle}
            </ActionLabel>
          </ActionButton>
        )}
      </Container>
    </>
  )
}

const Spacer = styled.View``
const Container = styled.View`
  ${tw(`absolute w-full justify-center flex-row
  items-center border-b`)};
  background-color: ${({ theme }) => theme.backgroundDark};
  border-color: ${({ theme }) => theme.border};
`
const Title = styled.Text`
  ${tw(`text-base font-semibold`)};
  color: ${({ theme }) => theme.text.body};
`
const HeaderButton = styled.TouchableOpacity`
  ${tw(
    `absolute left-1 bottom-1 w-11 h-11 
    items-center justify-center`
  )}
`
const ActionButton = styled.TouchableOpacity<{ isDisabled?: boolean }>`
  ${tw(`
    absolute right-4 bottom-3 rounded-full
    h-9 items-center justify-center px-4
  `)};
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.backgroundAlt : theme.primary.tint};
`
const ActionLabel = styled.Text<{ isDisabled?: boolean }>`
  ${tw(`font-bold`)};
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.text.muted : theme.text.light};
`
