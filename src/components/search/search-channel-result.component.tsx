import React from 'react'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { SearchChannel } from '@/hooks'
import { RemoteImage } from '../remote-image.component'

interface Props {
  item: SearchChannel
  onItemPress: () => void
}

export const SearchResultChannel = ({ item, onItemPress }: Props) => {
  return (
    <Wrapper onPress={onItemPress}>
      <Avatar>
        <RemoteImage source={item.avatarUrl} />
      </Avatar>
      <TextContainer>
        <Title>{item.name}</Title>
        <Description numberOfLines={2}>{item.description}</Description>
      </TextContainer>
    </Wrapper>
  )
}

const Wrapper = styled.TouchableOpacity`
  ${tw(`flex-1 flex-row px-4 items-center`)};
  height: 56px;
`
const Avatar = styled.View`
  ${tw(`h-11 w-11 rounded-full overflow-hidden`)}
`
const TextContainer = styled.View`
  ${tw(`flex-1 ml-4 justify-between`)}
`
const Title = styled.Text`
  ${tw(`text-sm font-semibold h-5 mb-0`)};
  color: ${({ theme }) => theme.text.body};
`
const Description = styled.Text`
  ${tw(`text-xs h-8`)};
  color: ${({ theme }) => theme.text.muted};
`
