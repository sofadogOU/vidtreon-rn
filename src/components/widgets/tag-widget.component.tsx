import * as React from 'react'
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { Placeholder } from '../placeholders.component'

interface Props extends TouchableOpacityProps {
  children: string
  selected: boolean
  style: StyleProp<ViewStyle>
  onPress: () => void
}

export const TagWidget = ({
  children,
  selected = false,
  style,
  onPress,
}: Props) => {
  return (
    <Container selected={selected} {...({ style } as any)} onPress={onPress}>
      {children === '' ? (
        <PlaceholderWrapper>
          <Placeholder animate={true} />
        </PlaceholderWrapper>
      ) : (
        <Label selected={selected}>{children}</Label>
      )}
    </Container>
  )
}

const Container = styled.TouchableOpacity<{ selected: boolean }>`
  ${tw(`h-8 items-center justify-center px-3 rounded-xl overflow-hidden`)};
  background-color: ${({ selected, theme }) =>
    selected ? theme.primary.tint : theme.backgroundAlt};
  min-width: 48px;
`
const Label = styled.Text<{ selected: boolean }>`
  ${tw(`text-xs font-semibold text-gray-800 text-center`)};
  min-width: 32px;
  color: ${({ selected, theme }) =>
    selected ? theme.text.light : theme.text.muted};
`
const PlaceholderWrapper = styled.View`
  ${tw(`absolute inset-0 bg-black`)}
`
