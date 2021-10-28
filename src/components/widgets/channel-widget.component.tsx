import * as React from 'react'
import { TouchableOpacityProps } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'

import { Channel } from '@/hooks/apis/api.typings'
import * as k from '@/utils/constants'

import { RemoteImage } from '../remote-image.component'

interface Props extends TouchableOpacityProps {
  item: Channel
}

export const ChannelWidget = ({ item, style, ...rest }: Props) => {
  return (
    <Wrapper {...style}>
      <Container {...rest}>
        <RemoteImage source={item.avatarUrl} />
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.View`
  ${tw(`flex-col w-10`)};
`
const Container = styled.TouchableOpacity`
  ${tw(`bg-black rounded-full overflow-hidden h-10 w-10`)};
`
