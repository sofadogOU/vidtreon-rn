import * as React from 'react'
import styled, { useTheme } from 'styled-components/native'
import tw from 'tailwind-rn'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import RNVideo from 'react-native-video'
import Spinner from 'react-native-spinkit'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Haptics from 'react-native-haptic-feedback'

import * as k from '@/utils/constants'
import { Comment } from '@/hooks'
import { bufferConfig } from '@/utils/video-helpers.util'

import { Icon } from '../icon.component'
import { RemoteImage } from '../remote-image.component'

dayjs.extend(relativeTime)

interface Props {
  item: Comment
  userId: string
  onReply?: (id: string, name: string) => void
  onPlayVideo?: () => void
  onCommentLike: (id: string, isLiked: boolean) => void
  onGotoReply?: (id: string) => void
  onRepliesPress?: (id: string) => void
  onReport: (id: string) => void
  commentingEnabled?: boolean
  playVideo?: boolean
  isReplies?: boolean
}

export const CommentsMessage = ({
  item,
  userId,
  onReply,
  onPlayVideo,
  onCommentLike,
  onGotoReply,
  onRepliesPress,
  onReport,
  commentingEnabled,
  playVideo,
  isReplies = false,
}: Props) => {
  const theme = useTheme()

  const [isPaused, setPaused] = React.useState(false)
  const [isLoading, setLoading] = React.useState(true)
  const [isPlaying, setPlaying] = React.useState(false)
  const [isLiked, setLiked] = React.useState(item.liked)
  const [likeCount, setLikeCount] = React.useState(item.likes)
  // const [avatarLoading, setAvatarLoading] = React.useState(true)
  // const [posterLoading, setPosterLoading] = React.useState(true)

  const alignedRight = item.user.id === userId

  React.useEffect(() => {
    if (playVideo) {
      // terminate(true)
      // kill main player
    } else {
      setPlaying(false)
      setPaused(false)
      setLoading(false)
    }
  }, [playVideo])

  const onAvatarPress = () => {
    // TODO: Go to Channel?
  }

  const onLikePress = () => {
    setLiked(v => {
      const isLiked = !v
      const newLikeCount = isLiked ? likeCount + 1 : likeCount - 1
      setLikeCount(newLikeCount)
      onCommentLike(item.id, isLiked)
      return isLiked
    })
    // Haptics.trigger('impactLight', k.hapticOptions)
    // setLikeCount(s => (s === likes ? s + 1 : s - 1))
    // setLiked(s => !s)
  }

  const convertEmoji = (str: string) => {
    return str.replace(/\[e-([0-9a-fA-F]+)\]/g, (match, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16))
    )
  }

  const renderTextMessage = (text: string, messageId?: string) => {
    if (text.length > 0 && text[0] === '@' && messageId) {
      const username = text.replace(/ .*/, '')
      const remainder = text.substr(text.indexOf(' ') + 1)
      return (
        <MessageText>
          <UsernameLink onPress={() => onGotoReply?.(messageId)}>
            {username}
          </UsernameLink>
          {` ${convertEmoji(remainder)}`}
        </MessageText>
      )
    }
    return <MessageText>{convertEmoji(text)}</MessageText>
  }

  return (
    <Container alignedRight={alignedRight}>
      <TouchableWithoutFeedback onPress={onAvatarPress}>
        <AvatarWrapper alignedRight={alignedRight}>
          <RemoteImage source={item.user.avatarUrl} />
        </AvatarWrapper>
      </TouchableWithoutFeedback>
      <Wrapper alignedRight={alignedRight}>
        <InfoWrapper>
          <Username numberOfLines={1} ellipsizeMode="tail">
            {item.user.username || item.user.firstName}
          </Username>
          <Posted numberOfLines={1} ellipsizeMode="tail">
            {dayjs(item.created).fromNow()}
          </Posted>
        </InfoWrapper>
        {item.type === 'text' &&
          item.text &&
          renderTextMessage(item.text, item.id)}
        {item.type === 'image' && item.imageUrl && (
          <MediaContainer>
            <PosterWrapper>
              <RemoteImage source={item.imageUrl} />
            </PosterWrapper>
          </MediaContainer>
        )}
        {item.type === 'video' && item.videoUrl && (
          <MediaContainer>
            <PlayPressable
              onPress={() => {
                Haptics.trigger('impactLight', k.hapticOptions)
                if (playVideo) {
                  setPaused(v => !v)
                  setPlaying(v => !v)
                }
                onPlayVideo?.()
              }}
            >
              {playVideo && (
                <Video
                  source={{ uri: item.videoUrl }}
                  resizeMode="cover"
                  repeat={true}
                  paused={isPaused}
                  onLoadStart={() => setLoading(true)}
                  onLoad={() => {
                    setLoading(false)
                    setPlaying(true)
                  }}
                  bufferConfig={k.isAndroid ? bufferConfig : undefined}
                />
              )}
              {!isPlaying && (
                <VideoView>
                  {isLoading ? (
                    <Spinner
                      type={k.isAndroid ? 'Pulse' : 'Arc'}
                      size={k.sizes.hit}
                      color="white"
                    />
                  ) : (
                    <Icon name="play" size="md" />
                  )}
                </VideoView>
              )}
            </PlayPressable>
          </MediaContainer>
        )}
        {!alignedRight && commentingEnabled && (
          <Actions>
            <ActionButton
              onPress={() =>
                onReply?.(item.id, item.user.username || item.user.firstName)
              }
            >
              <ActionLabel>Reply</ActionLabel>
            </ActionButton>
            <ActionLabel style={{ paddingHorizontal: k.sizes.xs }}>
              &bull;
            </ActionLabel>
            <ActionButton onPress={() => onReport(item.id)}>
              <ActionLabel>Report</ActionLabel>
            </ActionButton>
          </Actions>
        )}
        {isReplies && (
          <Actions>
            <ActionButton onPress={() => onReport(item.id)}>
              <ActionLabel>Report</ActionLabel>
            </ActionButton>
          </Actions>
        )}
        {!!item.replies && item.replies !== 0 && (
          <Replies>
            <ReplyAction onPress={() => onRepliesPress?.(item.id)}>
              <ReplyLabel>
                {item.replies} {item.replies === 1 ? 'Reply' : 'Replies'}
              </ReplyLabel>
            </ReplyAction>
          </Replies>
        )}
      </Wrapper>
      {!alignedRight && (commentingEnabled || isReplies) && (
        <LikeButton onPress={onLikePress}>
          {isLiked ? (
            <Icon name="heartFill" size="xs" color={theme.red} />
          ) : (
            <Icon name="heart" size="xs" />
          )}
          <LikeLabel>{likeCount}</LikeLabel>
        </LikeButton>
      )}
    </Container>
  )
}

const Container = styled.View<{ alignedRight: boolean }>`
  ${tw(`items-start mb-5`)};
  flex-direction: ${({ alignedRight }) =>
    alignedRight ? 'row-reverse' : 'row'};
`
const Wrapper = styled.View<{ alignedRight: boolean }>`
  ${tw(`flex-1`)};
  padding-right: ${({ alignedRight }) => (alignedRight ? 0 : k.sizes.md)}px;
  padding-left: ${({ alignedRight }) => (alignedRight ? k.sizes.md : 0)}px;
  align-items: ${({ alignedRight }) =>
    alignedRight ? 'flex-end' : 'flex-start'};
`
const InfoWrapper = styled.View`
  ${tw(`items-center mb-1`)};
  flex-direction: row;
`
const Username = styled.Text`
  ${tw(`flex-initial flex-shrink text-xs font-bold`)};
  color: white;
`
const Posted = styled.Text`
  ${tw(`text-gray-500 text-xs`)}
  margin-left: ${k.sizes.sm}px;
`
const MessageText = styled.Text`
  ${tw(`flex-1 text-sm`)};
  line-height: 18px;
  color: white;
`
const LikeButton = styled.TouchableOpacity`
  ${tw(`w-10 items-center justify-center`)}
`
const LikeLabel = styled.Text`
  ${tw(`text-xs mt-1`)};
  color: white;
`
const Actions = styled.View`
  ${tw(`flex-row items-center`)}
`
const ActionButton = styled.TouchableOpacity`
  ${tw(`h-6 items-center justify-center`)}
`
const ActionLabel = styled.Text`
  ${tw(`text-gray-500 text-xs`)}
`
const MediaContainer = styled.View`
  ${tw(`rounded-md my-1 overflow-hidden`)}
  height: ${k.screen.w / 2.5}px;
  width: ${k.screen.w / 2.5}px;
`
const PlayPressable = styled(TouchableOpacity)`
  ${tw(`h-full w-full`)}
`
const VideoView = styled.View`
  ${tw(`absolute inset-0 bg-black bg-opacity-75 items-center justify-center`)}
`
const Video = styled(RNVideo)`
  ${tw(`absolute inset-0 h-full w-full`)}
`
const AvatarWrapper = styled.View<{ alignedRight: boolean }>`
  ${tw(`h-11 w-11 rounded-full overflow-hidden`)};
  margin-right: ${({ alignedRight }) => (alignedRight ? 0 : 12)}px;
  margin-left: ${({ alignedRight }) => (alignedRight ? 12 : 0)}px;
`
const PosterWrapper = styled.View`
  ${tw(`h-full w-full`)}
`
const UsernameLink = styled(MessageText)`
  color: ${({ theme }) => theme.primary.tint};
`
const Replies = styled.View`
  ${tw(`mt-2 items-center justify-center`)};
`
const ReplyAction = styled.TouchableOpacity`
  ${tw(`p-1 px-2 rounded-full`)};
  background-color: ${({ theme }) => theme.secondary.tint};
`
const ReplyLabel = styled.Text`
  ${tw(`text-xs font-bold`)};
  color: ${({ theme }) => theme.white};
`
