import * as React from 'react'
import { TouchableWithoutFeedback, ScrollView, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { View as MotiView } from 'moti'
import Scrubber from 'react-native-scrubber'

import * as k from '@/utils/constants'
import { Video } from '@/hooks'

import { useTranslation } from '@/providers/TranslationProvider'

import { Icon } from '../icon.component'
import { SectionTitle } from '../section-title.component'
import { RelatedVideos } from './related-videos.component'
import { RemoteImage } from '../remote-image.component'

dayjs.extend(relativeTime)

export enum Skip {
  forwards = 1,
  backwards,
}

interface Props {
  paused: boolean
  progress: number
  duration: number
  buffered: number
  muted: boolean

  onMuteChange: () => void
  onPlaybackChange: () => void
  onSkip: (dir: Skip) => void
  onScrub: (ms: number) => void

  onChannelPress: () => void
  onVideoChange: (videoId: string) => void
  onPremiumVideoPress: (feedId: string) => void
  onSharePress: () => void

  onLikePress?: () => void
  onClose: () => void
  onViewCommentsPress: () => void

  channelName: string
  avatarUrl: string
  title: string
  description: string
  commentCount: number
  shares?: number
  likes: string
  liked: boolean
  uploaded: string
  relatedVideos?: Video[]
  isSubscribed: boolean
}

export const VideoControls = (props: Props) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const i18n = useTranslation()

  const [isShowing, setShowing] = React.useState(false)

  const handleSlidingComplete = (value: number) => {
    setShowing(true)
    props.onScrub(value)
    // setProgress(value)
  }

  // const handleSharePress = () => {
  //   // const { id, title, description: message } = media
  //   // Haptics.trigger('impactLight', k.hapticOptions)
  //   // if (!paused) {
  //   //   onChange()
  //   // }
  //   // share.create({ id, title, message, feature: 'share_video' })
  // }

  const handleItemPress = (
    videoId: string,
    feedId: string,
    isPremium: boolean
  ) => {
    if (isPremium) {
      props.onPremiumVideoPress(feedId)
    } else {
      props.onVideoChange(videoId)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowing(s => !s)}>
      <Container
        animate={{ opacity: isShowing ? 1 : 0 }}
        transition={{ type: 'timing', duration: 200 }}
        pointerEvents={isShowing ? 'auto' : 'box-only'}
      >
        <SafeWrapper
          style={{ marginBottom: insets.bottom, marginTop: insets.top }}
        >
          <InnerContainer>
            <Header>
              <TouchableWithoutFeedback onPress={props.onChannelPress}>
                <AvatarWrapper>
                  <RemoteImage source={props.avatarUrl} />
                </AvatarWrapper>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={props.onChannelPress}>
                <TitleWrapper>
                  <TitleLabel numberOfLines={0} ellipsizeMode="tail">
                    {props.channelName}
                  </TitleLabel>
                </TitleWrapper>
              </TouchableWithoutFeedback>
              {!props.isSubscribed && (
                <SubscribeButton onPress={props.onChannelPress}>
                  <SubscribeLabel>Subscribe</SubscribeLabel>
                </SubscribeButton>
              )}
              <CloseButton onPress={props.onClose}>
                <Icon name="closeCircle" />
              </CloseButton>
            </Header>
            <DetailsWrapper>
              <UploadLabel>{dayjs(props.uploaded).fromNow()}</UploadLabel>
              <Subtitle numberOfLines={0} ellipsizeMode="tail">
                {props.title}
              </Subtitle>
              <ScrollWrapper>
                <View
                  onStartShouldSetResponder={() => true}
                  // onTouchEnd={() => setShowing(s => !s)}
                >
                  <DescriptionText ellipsizeMode="tail">
                    {props.description}
                  </DescriptionText>
                </View>
              </ScrollWrapper>
            </DetailsWrapper>
            <Footer>
              <SectionTitle
                containerStyle={{ paddingLeft: k.sizes.lg }}
                textStyle={{ color: 'white' }}
              >
                {i18n.t('controls_section1')}
              </SectionTitle>
              <RelatedVideos
                items={props.relatedVideos}
                onItemPress={handleItemPress}
              />
              <ControlsWrapper>
                <PlaybackContainer>
                  <MuteButton onPress={props.onMuteChange}>
                    <Icon name={props.muted ? 'unmute' : 'mute'} size="sm" />
                  </MuteButton>
                  <TrackButton
                    style={{ marginRight: k.sizes.md }}
                    onPress={() => props.onSkip(Skip.backwards)}
                  >
                    <Icon name="backward" size={36} />
                    <TrackLabel>10</TrackLabel>
                  </TrackButton>
                  <PlayButton onPress={props.onPlaybackChange}>
                    {props.paused ? (
                      <Icon
                        name="play"
                        color="black"
                        size="xs"
                        containerStyle={{ paddingLeft: 3 }}
                      />
                    ) : (
                      <Icon name="pause" color="black" size="xs" />
                    )}
                  </PlayButton>
                  <TrackButton
                    style={{ marginLeft: k.sizes.md }}
                    onPress={() => props.onSkip(Skip.forwards)}
                  >
                    <Icon name="forward" size={36} />
                    <TrackLabel>10</TrackLabel>
                  </TrackButton>
                </PlaybackContainer>
                <ProgressContainer>
                  <Scrubber
                    onSlidingComplete={handleSlidingComplete}
                    value={props.progress}
                    bufferedValue={props.buffered}
                    totalDuration={props.duration}
                    trackColor={theme.primary.tint}
                    scrubbedColor={theme.primary.tint}
                    trackBackgroundColor="rgba(255,255,255,0.2)"
                    bufferedTrackColor="rgba(255,255,255,0.4)"
                  />
                </ProgressContainer>
                <OptionsContainer>
                  {props.onLikePress && (
                    <OptionButton onPress={props.onLikePress}>
                      <Icon
                        name={props.liked ? 'heartFill' : 'heart'}
                        size="sm"
                        color={props.liked ? theme.red : theme.white}
                      />
                      <OptionLabel>{props.likes}</OptionLabel>
                    </OptionButton>
                  )}
                  <OptionButton onPress={props.onViewCommentsPress}>
                    <Icon name="comment" size="sm" />
                    <OptionLabel>{props.commentCount}</OptionLabel>
                  </OptionButton>
                  <OptionButton onPress={props.onSharePress}>
                    <Icon name="share" size="sm" />
                    {/* <OptionLabel>{props.shares || 0}</OptionLabel> */}
                  </OptionButton>
                  {/* <OptionButton>
                  <Icon name="more" size="sm" />
                  <OptionLabel>More</OptionLabel>
                </OptionButton> */}
                </OptionsContainer>
              </ControlsWrapper>
            </Footer>
          </InnerContainer>
        </SafeWrapper>
      </Container>
    </TouchableWithoutFeedback>
  )
}

const Container = styled(MotiView)`
  ${tw(`justify-center items-center bg-black bg-opacity-75 h-full`)};
  width: ${k.screen.w}px;
`
const SafeWrapper = styled.SafeAreaView`
  ${tw(`flex-1 w-full`)}
`
const InnerContainer = styled.View`
  ${tw(`flex-1 pb-6 pt-2`)}
`
const Header = styled.View`
  ${tw(`flex-row px-6 items-center`)}
`
const Footer = styled.View`
  ${tw(`flex-1 justify-end mt-8`)}
`
const ControlsWrapper = styled.View`
  ${tw(`px-12`)}
`
const DetailsWrapper = styled.View`
  ${tw(`flex-1 px-6 mt-2`)};
`
const TitleWrapper = styled.View`
  ${tw(`flex-1 flex-row items-center`)}
`
const ScrollWrapper = styled(ScrollView)`
  ${tw(`flex-1 mt-4 mb-8`)};
`
const TitleLabel = styled.Text`
  ${tw(`flex-initial flex-shrink text-sm font-bold text-white`)}
`
const UploadLabel = styled.Text`
  ${tw(`text-gray-500 text-xs font-normal mt-2`)}
`
const Subtitle = styled.Text`
  ${tw(`text-white text-xs mt-2 font-bold`)}
`
const DescriptionText = styled.Text`
  ${tw(`text-white text-xs`)}
`
const CloseButton = styled.TouchableOpacity`
  ${tw(`h-8 w-8 ml-6`)}
`
const PlaybackContainer = styled.View`
  ${tw(`flex-row justify-center items-center mb-2`)}
`
const OptionsContainer = styled.View`
  ${tw(`flex-row justify-between`)}
`
const PlayButton = styled.TouchableOpacity`
  ${tw(`h-12 w-12 bg-white rounded-full items-center justify-center`)}
`
const TrackButton = styled.TouchableOpacity`
  ${tw(`h-12 w-12 items-center justify-center`)}
`
const TrackLabel = styled.Text`
  ${tw(`absolute text-white font-bold`)};
  font-size: 9px;
`
const ProgressContainer = styled.View`
  ${tw(`relative h-8 justify-center mb-6 mt-4`)}
`
const OptionButton = styled.TouchableOpacity`
  ${tw(`items-center h-11 w-11`)}
`
const OptionLabel = styled.Text`
  ${tw(`mt-1 text-white text-xs capitalize`)}
`
const MuteButton = styled.TouchableOpacity`
  ${tw(`absolute left-0 w-9 h-9 items-center justify-center`)}
`
const AvatarWrapper = styled.View`
  ${tw(`w-11 h-11 rounded-full mr-3 overflow-hidden`)}
`
const SubscribeButton = styled.TouchableOpacity`
  ${tw(`py-2 px-3 ml-2 justify-center items-center rounded-full`)};
  background-color: ${({ theme }) => theme.primary.tint};
`
const SubscribeLabel = styled.Text`
  ${tw(`text-sm text-white`)};
`
