import * as React from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient'
import Haptics from 'react-native-haptic-feedback'
import { MotiView } from 'moti'

import { Video } from '@/hooks/apis/api.typings'
import * as k from '@/utils/constants'
import { millisToMinutesAndSeconds } from '@/utils/video-helpers.util'

import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'
import { RemoteImage } from '../remote-image.component'

const GRADIENT_PROPS: LinearGradientProps = {
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
  colors: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)'],
}

interface Props extends Video {
  onItemPress: () => void
  onDetailPress?: () => void
  onChannelPress?: () => void
  containerStyle?: StyleProp<ViewStyle>
  isPremium?: boolean
  hideAvatars?: boolean
}

export const VideoGalleryItem = (props: Props) => {
  const {
    onItemPress,
    onDetailPress,
    onChannelPress,
    containerStyle,
    isPremium,
    hideAvatars,
    ...item
  } = props

  const i18n = useTranslation()
  const theme = useTheme()

  const handleDetailPress = (e: GestureResponderEvent) => {
    e.preventDefault()
    Haptics.trigger('impactLight', k.hapticOptions)
    onDetailPress?.()
  }

  const renderBadgeWrapper = k.isAndroid ? (
    isPremium ? (
      <PremiumBadgeWrapper>
        <PremiumBadge>
          <Icon name="premium" size={11} color={theme.text.light} />
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
    >
      <PremiumBadge>
        <Icon name="premium" size={11} color={theme.text.light} />
      </PremiumBadge>
    </AnimatedBadgeWrapper>
  )

  return (
    <>
      <TouchableWithoutFeedback
        onPress={isPremium ? onChannelPress : onItemPress}
      >
        <ItemWrapper {...containerStyle}>
          <ItemContainer>
            <LoadingWrapper
              style={{ opacity: 1 }}
              isWatching={item.seekPosition !== undefined}
            >
              <ItemPosterWrapper>
                <RemoteImage source={item.posterUrl} />
              </ItemPosterWrapper>
              <ItemGradient {...GRADIENT_PROPS} />
              <ItemHeader>
                {!hideAvatars && (
                  <ItemAvatarWrapper>
                    <RemoteImage source={item.channel?.avatarUrl} />
                  </ItemAvatarWrapper>
                )}
                {renderBadgeWrapper}
              </ItemHeader>
              <ItemBody>
                <ItemTitle numberOfLines={2} ellipsizeMode="tail">
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
                <ItemMenuBtn onPress={handleDetailPress}>
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
}>`
  ${tw(`flex-1 p-3`)};
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
const ItemAvatarWrapper = styled.View`
  ${tw(`rounded-full overflow-hidden mr-1 h-6 w-6`)};
`
const ItemBody = styled.View`
  ${tw(`flex-1 justify-end`)}
`
const ItemTitle = styled.Text`
  ${tw(`text-xs text-white font-bold`)};
  margin-bottom: 2px;
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
const ItemMenuBtn = styled.TouchableOpacity`
  ${tw(`w-11 h-11 absolute top-2 right-0 justify-start items-end`)};
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
const PremiumBadgeWrapper = styled(MotiView)`
  ${tw(`rounded-full overflow-hidden items-center justify-center h-6 w-6`)};
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
const AnimatedBadgeWrapper = styled(MotiView)`
  ${tw(`rounded-full overflow-hidden items-center justify-center h-6 w-6`)};
  background-color: ${({ theme }) => theme.tag.gold.bg};
`
