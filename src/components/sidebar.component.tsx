import { useTranslation } from '@/providers'
import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'

import { SafeWrapper } from './wrappers.component'

interface Props {
  children: React.ReactNode
  title: string
  onClear: () => void
}

export const Sidebar = ({ children, title, onClear }: Props) => {
  const theme = useTheme()
  const i18n = useTranslation()
  return (
    <SafeWrapper fill style={{ backgroundColor: theme.backgroundDark }}>
      <Container>
        <TitleWrapper>
          <Title numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Title>
          <ClearButton onPress={onClear}>
            <ClearLabel>{i18n.t('clear_all')}</ClearLabel>
          </ClearButton>
        </TitleWrapper>
        {children}
      </Container>
    </SafeWrapper>
  )
}

const Container = styled.View`
  ${tw(`flex-1 items-center justify-start`)};
  background-color: ${({ theme }) => theme.backgroundDark};
`
const TitleWrapper = styled.View`
  ${tw(`w-full flex-row items-center justify-between mb-6 border-b pb-4 px-6`)};
  border-color: ${({ theme }) => theme.backgroundAlt};
`
const Title = styled.Text`
  ${tw(`text-sm font-bold mr-2 flex-1`)};
  color: ${({ theme }) => theme.text.body};
`
const ClearButton = styled.TouchableOpacity`
  ${tw(`h-6 px-2 rounded-full items-center justify-center`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
const ClearLabel = styled.Text`
  ${tw(`text-xs`)};
  line-height: 14px;
  color: ${({ theme }) => theme.text.light};
`
