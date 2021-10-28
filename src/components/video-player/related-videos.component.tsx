import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'

import { millisToMinutesAndSeconds } from '@/utils/video-helpers.util'
import * as k from '@/utils/constants'

import { RemoteImage } from '../remote-image.component'
import { Icon } from '../icon.component'

import { Video } from '@/hooks'

const WIDGET_WIDTH = (k.screen.w - k.sizes.lg * 2) / 3 - k.sizes.lg / 3

const GRADIENT_PROPS: LinearGradientProps = {
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
  colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)'],
}

interface Props {
  items?: Video[]
  onItemPress: (id: string, feedId: string, isPremium: boolean) => void
}

interface VideoWidgetProps {
  item: Video
  onItemPress: (id: string, feedId: string, isPremium: boolean) => void
}

const VideoWidget = ({ item, onItemPress }: VideoWidgetProps) => {
  const theme = useTheme()

  const handlePress = () => {
    onItemPress(item.id, item.channel.feedId, !!item.isPremium)
  }

  return (
    <Preview key={item.id} onPress={handlePress}>
      <BackgroundImageWrapper>
        <RemoteImage source={item.posterUrl} />
        <ItemGradient {...GRADIENT_PROPS} />
      </BackgroundImageWrapper>
      <BadgeWrapper>
        <AvatarWrapper>
          <RemoteImage source={item.channel.avatarUrl} />
        </AvatarWrapper>
        {item.isPremium && (
          <PremiumBadgeWrapper>
            <PremiumBadge>
              <Icon name="premium" size={11} color={theme.text.light} />
            </PremiumBadge>
          </PremiumBadgeWrapper>
        )}
      </BadgeWrapper>
      <ItemFooter>
        <ItemTitle numberOfLines={2} ellipsizeMode="tail">
          {item.title}
        </ItemTitle>
        <DetailsWrapper>
          <ViewsWrapper>
            <Icon size={11} name="eye" containerStyle={{ marginRight: 4 }} />
            <Footnote>{item.viewCount}</Footnote>
          </ViewsWrapper>
          <Footnote>{millisToMinutesAndSeconds(item.duration)}</Footnote>
        </DetailsWrapper>
      </ItemFooter>
    </Preview>
  )
}

export const RelatedVideos = ({ items, onItemPress }: Props) => {
  return (
    <Container>
      {items?.slice(0, 3).map(item => {
        return (
          <VideoWidget key={item.id} item={item} onItemPress={onItemPress} />
        )
      })}
    </Container>
  )
}

const Container = styled.View`
  ${tw(`flex-row mx-6 justify-between mb-12 mt-3`)};
`
const Preview = styled.TouchableOpacity`
  ${tw(`flex-col rounded-xl p-2 justify-between`)};
  width: ${WIDGET_WIDTH}px;
  height: ${WIDGET_WIDTH}px;
  box-shadow: 0 3px 2px rgba(0, 0, 0, 0.3);
  elevation: 3;
`
const BadgeWrapper = styled.View`
  ${tw(`flex-row`)}
`
const AvatarWrapper = styled.View`
  ${tw(`h-8 w-8 overflow-hidden rounded-full`)}
`
const BackgroundImageWrapper = styled.View`
  ${tw(`absolute inset-0 rounded-xl overflow-hidden`)}
`
const ItemGradient = styled(LinearGradient)`
  ${tw(`absolute inset-0`)}
`
const ItemFooter = styled.View``
const ItemTitle = styled.Text`
  ${tw(`font-semibold text-xs text-white`)}
`
const DetailsWrapper = styled.View`
  ${tw(`flex-row justify-between mt-1`)}
`
const Footnote = styled.Text`
  ${tw(`text-xs uppercase font-semibold text-white`)};
  font-size: 9px;
`
const PremiumBadgeWrapper = styled.View`
  ${tw(
    `rounded-full overflow-hidden items-center justify-center h-8 w-8 ml-1`
  )};
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
const PremiumBadge = styled.View`
  ${tw(`h-full w-full items-center justify-center`)}
`
const ViewsWrapper = styled.View`
  ${tw(`flex-row`)}
`
