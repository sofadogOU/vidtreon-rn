import React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { Button } from './buttons.component'

interface Props {
  title: string
  description?: string
  buttonTitle?: string
  onButtonPress?: () => void
}

export const EmptyStateView = ({
  title,
  description,
  buttonTitle,
  onButtonPress,
}: Props) => {
  return (
    <Wrapper>
      <Container>
        <Title>{title}</Title>
        {description !== undefined && <Description>{description}</Description>}
        {onButtonPress && buttonTitle && (
          <ButtonWrapper>
            <Button onPress={onButtonPress}>
              <Button.Label>{buttonTitle}</Button.Label>
            </Button>
          </ButtonWrapper>
        )}
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.View`
  ${tw(`h-full flex-1 px-4 pt-2 items-center justify-center`)};
`
const Container = styled.View`
  ${tw(`w-full items-center justify-center p-8 rounded-xl`)};
  background-color: ${({ theme }) => theme.backgroundDark};
`
const Title = styled.Text`
  ${tw(`text-sm text-center font-bold`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-base text-center text-sm mt-2`)};
  color: ${({ theme }) => theme.text.body};
`
const ButtonWrapper = styled.View`
  ${tw(`mt-4`)}
`
