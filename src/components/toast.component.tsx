import React from 'react'
import { BaseToastProps } from 'react-native-toast-message'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { Icon } from './icon.component'
import * as k from '@/utils/constants'

export const toastConfig = {
  warn: ({ text1, text2 }: BaseToastProps) => (
    <Wrapper>
      <Container>
        <Indicator>
          <Icon name="premium" size="xs" color="white" />
        </Indicator>
        <TextWrapper>
          <Title>{text1}</Title>
          <Subtitle>{text2}</Subtitle>
        </TextWrapper>
      </Container>
    </Wrapper>
  ),
}

const Wrapper = styled.View`
  ${tw(`w-full px-4`)};
  padding-top: ${k.isAndroid ? 0 : 16};
`
const Container = styled.View`
  ${tw(`w-full h-full rounded-lg p-4 flex-row items-center`)};
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 3px 2px rgba(0, 0, 0, 0.3);
  elevation: 5;
`
const TextWrapper = styled.View`
  ${tw(`flex-1`)}
`
const Title = styled.Text`
  ${tw(`text-sm font-bold`)};
  color: ${({ theme }) => theme.text.body};
`
const Subtitle = styled.Text`
  ${tw(`text-sm`)};
  color: ${({ theme }) => theme.text.body};
`
const Indicator = styled.View`
  ${tw(`w-8 h-8 items-center justify-center rounded-full mr-4`)}
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
