import * as React from 'react'
import { TextProps, TouchableOpacityProps, ViewProps } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import * as k from '@/utils/constants'

import { Icon, IconNamesEnum, IconSize } from './icon.component'

type ButtonType = 'default' | 'social' | 'icon'

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactElement | React.ReactElement[]
  onPress: () => void
  type?: ButtonType
}

interface LabelProps extends TextProps {
  children: React.ReactNode
  type?: ButtonType
}

interface IconProps extends ViewProps {
  name: IconNamesEnum
  type?: ButtonType
  color?: string
  size?: IconSize | number
}

export const Button = ({ children, ...rest }: ButtonProps) => {
  const { type = 'default', onPress } = rest
  return (
    <ButtonPressable type={type} {...(rest as unknown)} onPress={onPress}>
      <ButtonContainer>
        {React.Children.map(children, child => {
          // pass parents' props to `children` prop
          return React.cloneElement(child, { type })
        })}
      </ButtonContainer>
    </ButtonPressable>
  )
}

const ButtonLabel = ({ children, type = 'default', ...rest }: LabelProps) => {
  return (
    <ButtonText type={type} {...(rest as unknown)}>
      {children}
    </ButtonText>
  )
}

const ButtonIcon = ({
  name,
  type = 'default',
  style,
  color,
  size = 'xs',
}: IconProps) => {
  return (
    <ButtonIconView type={type} {...style}>
      <Icon name={name} size={size} color={color} />
    </ButtonIconView>
  )
}

Button.Label = ButtonLabel
Button.Icon = ButtonIcon

const ButtonPressable = styled.TouchableOpacity<{ type: ButtonType }>`
  ${tw(`justify-center items-center rounded-full`)}
  background-color: ${({ theme }) => theme.primary.tint};
  height: ${k.sizes.hit}px;
`
const ButtonContainer = styled.View`
  ${tw(`flex-row px-4 justify-center items-center`)}
`
const ButtonIconView = styled.View<{ type: ButtonType }>`
  margin-right: ${({ type }) => (type === 'icon' ? 0 : k.sizes.sm)}px;
`
const ButtonText = styled.Text<{ type: ButtonType }>`
  ${tw(`text-base font-semibold`)};
  ${!k.isAndroid && `line-height: 0`};
  color: ${({ type, theme }) =>
    type === 'social' ? theme.social.text : theme.white};
`
