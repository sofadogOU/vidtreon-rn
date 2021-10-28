import * as React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import * as k from '@/utils/constants'
import { Icon } from '../icon.component'

export type FilterType = 'all' | 'text' | 'video'

interface Props {
  title: string
  onClosePress?: () => void
  onBackPress?: () => void
}

export const CommentsHeader = ({ title, onClosePress, onBackPress }: Props) => {
  const insets = useSafeAreaInsets()

  const wrapperStyle = { marginTop: k.isAndroid ? insets.top : 0 }

  return (
    <Wrapper style={wrapperStyle}>
      <Container>
        {onBackPress && (
          <BackButton onPress={onBackPress}>
            <Icon name="backArrow" size="sm" />
          </BackButton>
        )}
        <Title>{title}</Title>
        {onClosePress && (
          <CloseButton onPress={onClosePress}>
            <Icon name="closeCircle" />
          </CloseButton>
        )}
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.View`
  ${tw(
    `w-full overflow-hidden h-14 
    justify-center items-center 
    border-b border-white`
  )};
`
const Container = styled.View`
  ${tw(`relative w-full items-center justify-center`)}
`
const Title = styled.Text`
  ${tw(`text-white text-base font-semibold`)}
`
const CloseButton = styled.TouchableOpacity`
  ${tw(`h-8 w-8 absolute right-6 items-center justify-center`)}
`
const BackButton = styled.TouchableOpacity`
  ${tw(`h-8 w-8 absolute left-4 items-center justify-center`)}
`
