import * as React from 'react'
import { GestureResponderEvent, TouchableWithoutFeedback } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import Haptics from 'react-native-haptic-feedback'
import { MotiView } from 'moti'
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { Video } from '@/hooks/apis/api.typings'
import * as k from '@/utils/constants'
import {
  GridLayout,
  GridHeight,
  millisToMinutesAndSeconds,
} from '@/utils/video-helpers.util'

import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'
import { RemoteImage } from '../remote-image.component'

const GRADIENT_PROPS: LinearGradientProps = {
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
  colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)'],
}

const FULL_WIDTH_SLIDE = k.screen.w - k.sizes.defPadding * 2

interface Props extends Video {
  itemWidth?: number
  itemHeight?: number
  onItemPress: () => void
  onDetailPress?: () => void
  onChannelPress?: () => void
  hideAvatar?: boolean
  isFeatured?: boolean
  layout: GridLayout
  height?: GridHeight
  isPremium?: boolean
}

export const VideoWidget = (props: Props) => {
  const {
    itemWidth,
    itemHeight,
    onItemPress,
    onDetailPress,
    onChannelPress,
    hideAvatar,
    isFeatured,
    layout,
    height,
    isPremium,
    ...item
  } = props

  const i18n = useTranslation()
  const theme = useTheme()

  const ITEM_WIDTH = itemWidth || '100%'
  const ITEM_HEIGHT = itemHeight || ITEM_WIDTH

  const handleDetailPress = (e: GestureResponderEvent) => {
    e.preventDefault()
    Haptics.trigger('impactLight', k.hapticOptions)
    onDetailPress?.()
  }

  const renderBadgeWrapper = k.isAndroid ? (
    isPremium ? (
      <PremiumBadgeWrapper extraPadding={layout === '1-col' || height === 'lg'}>
        <PremiumBadge>
          <Icon
            name="premium"
            size={layout === '1-col' ? 14 : 11}
            color={theme.text.light}
          />
        </PremiumBadge>
      </PremiumBadgeWrapper>
    ) : null
  ) : (
    <AnimatedBadgeWrapper
      animate={{ opacity: isPremium ? 1 : 0 }}
      transition={{
        type: 'timing',
        duration: 350,
      }}
      extraPadding={layout === '1-col' || height === 'lg'}
    >
      <PremiumBadge>
        <Icon
          name="premium"
          size={layout === '1-col' || height === 'lg' ? 14 : 11}
          color={theme.text.light}
        />
      </PremiumBadge>
    </AnimatedBadgeWrapper>
  )

  return (
    <>
      <TouchableWithoutFeedback
        onPress={
          item.videoUrl
            ? isPremium
              ? onChannelPress
              : onItemPress
            : () => null
        }
      >
        <ItemWrapper
          style={{
            width: isFeatured ? FULL_WIDTH_SLIDE : ITEM_WIDTH,
            height: ITEM_HEIGHT,
            paddingRight: isFeatured ? 0 : 16,
          }}
        >
          <ItemContainer>
            <LoadingWrapper
              style={{ opacity: 1 }}
              isWatching={item.seekPosition !== undefined}
              extraPadding={layout === '1-col' || height === 'lg'}
            >
              <ItemPosterWrapper>
                <RemoteImage source={item.posterUrl} />
              </ItemPosterWrapper>
              <ItemGradient {...GRADIENT_PROPS} />
              <ItemHeader>
                {!hideAvatar && (
                  <ItemAvatarWrapper
                    extraPadding={layout === '1-col' || height === 'lg'}
                  >
                    <RemoteImage source={item.channel?.avatarUrl} />
                  </ItemAvatarWrapper>
                )}
                {renderBadgeWrapper}
              </ItemHeader>
              <ItemBody>
                <ItemTitle
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  extraPadding={layout === '1-col' || height === 'lg'}
                >
                  {item.title}
                </ItemTitle>
              </ItemBody>
              {item.viewCount !== '' && (
                <ItemFooter>
                  <ItemFooterContainer>
                    <ItemFooterText>
                      <Capitalize>{item.viewCount}</Capitalize>{' '}
                      {i18n.t('label_views')}
                    </ItemFooterText>
                    <ItemFooterText>
                      {millisToMinutesAndSeconds(item.duration)}
                    </ItemFooterText>
                  </ItemFooterContainer>
                </ItemFooter>
              )}
              {onDetailPress && item.title !== '' && (
                <ItemMenuBtn
                  extraPadding={layout === '1-col' || height === 'lg'}
                  onPress={handleDetailPress}
                >
                  <Icon name="miniMenu" size="sm" />
                </ItemMenuBtn>
              )}
              {typeof item.seekPosition === 'number' ? (
                <ItemWatchedBar>
                  <ItemWatchedBarProgress progress={item.seekPosition} />
                </ItemWatchedBar>
              ) : null}
            </LoadingWrapper>
          </ItemContainer>
        </ItemWrapper>
      </TouchableWithoutFeedback>
    </>
  )
}

const ItemWrapper = styled.View`
  ${tw(`relative w-full h-full`)};
`
const ItemContainer = styled.View`
  ${tw(`flex-1 rounded-xl overflow-hidden`)};
  background-color: ${({ theme }) => theme.backgroundAlt};
`
const LoadingWrapper = styled.View<{
  isWatching: boolean
  extraPadding: boolean
}>`
  ${tw(`flex-1`)};
  ${({ isWatching }) =>
    isWatching &&
    `border-bottom-left-radius: 0px; border-bottom-right-radius: 0px`};
  padding-left: ${({ extraPadding }) => (extraPadding ? 12 : 8)}px;
  padding-right: ${({ extraPadding }) => (extraPadding ? 12 : 8)}px;
  padding-top: ${({ extraPadding }) => (extraPadding ? 12 : 8)}px;
  padding-bottom: ${({ extraPadding }) => (extraPadding ? 12 : 8)}px;
`

const ItemPosterWrapper = styled.View`
  ${tw(`absolute inset-0`)}
`
const ItemGradient = styled(LinearGradient)`
  ${tw(`absolute inset-0`)}
`
const ItemHeader = styled.View`
  ${tw(`flex-row`)}
`
const ItemAvatarWrapper = styled.View<{ extraPadding: boolean }>`
  ${tw(`rounded-full overflow-hidden mr-1`)};
  height: ${({ extraPadding }) => (extraPadding ? k.sizes.xl : k.sizes.lg)}px;
  width: ${({ extraPadding }) => (extraPadding ? k.sizes.xl : k.sizes.lg)}px;
`
const ItemBody = styled.View`
  ${tw(`flex-1 justify-end`)}
`
const ItemTitle = styled.Text<{ extraPadding: boolean }>`
  ${tw(`text-xs text-white font-bold`)};
  margin-bottom: ${({ extraPadding }) => (extraPadding ? k.sizes.sm : 2)}px;
`
const ItemFooter = styled.View``
const ItemFooterContainer = styled.View`
  ${tw(`flex-row justify-between mt-1`)};
`
const ItemFooterText = styled.Text`
  ${tw(`text-white font-bold lowercase`)}
  font-size: 9px;
`
const Capitalize = styled.Text`
  ${tw(`capitalize`)}
`
const ItemMenuBtn = styled.TouchableOpacity<{ extraPadding: boolean }>`
  ${tw(`w-11 h-11 absolute top-0 right-0 justify-start items-end`)};
  right: ${({ extraPadding }) => (extraPadding ? 12 : 0)}px;
  top: ${({ extraPadding }) => (extraPadding ? 16 : 8)}px;
`
const ItemWatchedBar = styled.View`
  ${tw(`bg-gray-300 absolute bottom-0 left-0 right-0`)};
  height: 3px;
`
const ItemWatchedBarProgress = styled.View<{ progress: number }>`
  background-color: ${({ theme }) => theme.primary.tint};
  height: 100%;
  width: ${({ progress }) => progress}%;
`
const PremiumBadge = styled.View`
  ${tw(`h-full w-full items-center justify-center`)}
`
const PremiumBadgeWrapper = styled(MotiView)<{ extraPadding: boolean }>`
  ${tw(`rounded-full overflow-hidden items-center justify-center`)};
  height: ${({ extraPadding }) => (extraPadding ? k.sizes.xl : k.sizes.lg)}px;
  width: ${({ extraPadding }) => (extraPadding ? k.sizes.xl : k.sizes.lg)}px;
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
const AnimatedBadgeWrapper = styled(MotiView)<{ extraPadding: boolean }>`
  ${tw(`rounded-full overflow-hidden items-center justify-center`)};
  height: ${({ extraPadding }) => (extraPadding ? k.sizes.xl : k.sizes.lg)}px;
  width: ${({ extraPadding }) => (extraPadding ? k.sizes.xl : k.sizes.lg)}px;
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
