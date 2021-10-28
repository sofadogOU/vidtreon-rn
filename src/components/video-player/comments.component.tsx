import * as React from 'react'
import { StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import { FlatList } from 'react-native-gesture-handler'
import dayjs from 'dayjs'
import faker from 'faker'
import { orderBy } from 'lodash-es'
import { useTranslation } from '@/providers/TranslationProvider'

const emojiRegex = require('emoji-regex/RGI_Emoji')
const emojiRegexPattern = emojiRegex()

import * as k from '@/utils/constants'
import {
  Comment,
  useLike,
  useUnlike,
  usePostComment,
  User,
  useUpload,
} from '@/hooks'

import { CommentsList } from '../comment/comments-list.component'
import { CommentsHeader } from '../comment/comments-header.component'
import { CommentsInput, Reply } from '../comment/comments-input.component'
import { MediaPicker } from '../media-picker.component'
import { ImagePickerResponse } from 'react-native-image-picker'
import { createFormData } from '@/utils/video-helpers.util'

type CommentOptions = {
  type: 'image' | 'video' | 'text'
  text?: string
  imageUrl?: string
  videoUrl?: string
}

interface Props {
  videoId: string
  comments?: Comment[]
  user: User
  commentingEnabled: boolean
  isShowing: boolean
  onBackPress?: () => void
  onCommentPlay: () => void
  onReportComment: (id: string) => void
  onCommentsChange?: (count: number) => void
  onRepliesPress: (id: string) => void
}

export const VideoComments = ({
  videoId,
  comments,
  user,
  commentingEnabled,
  isShowing,
  onBackPress,
  onCommentPlay,
  onReportComment,
  onCommentsChange,
  onRepliesPress,
}: Props) => {
  const flatlistRef = React.useRef<FlatList<Comment>>(null)
  const [replyValue, setReplyValue] = React.useState<Reply | undefined>()
  const [messages, setMessages] = React.useState(comments)
  const [showMediaPicker, setShowMediaPicker] = React.useState(false)

  const i18n = useTranslation()
  const doLike = useLike()
  const doUnlike = useUnlike()
  const postComment = usePostComment()
  const upload = useUpload()

  React.useEffect(() => {
    if (comments) {
      setMessages(comments)
    }
  }, [comments])

  React.useEffect(() => {
    if (messages) {
      onCommentsChange?.(messages.length)
    }
  }, [messages, onCommentsChange])

  /** Utility Methods */

  const scrollToBottom = () => {
    setTimeout(() => flatlistRef.current?.scrollToEnd(), 0)
  }

  /** Comment Methods */

  const handleCommentReply = (id: string, name: string) => {
    setReplyValue(undefined)
    setTimeout(() => setReplyValue({ name, id }), 0)
  }

  const handleCommentLike = (id: string, isLiked: boolean) => {
    // TODO: handle unlike for comments
    if (isLiked) {
      doLike.mutate({ resourceType: 'comment', ref: [videoId, id] })
    } else {
      doUnlike.mutate({ resourceType: 'comment', ref: [videoId, id] })
    }
  }

  const handleCommentSend = (text: string, replyId?: string) => {
    const emojiSafeText = text.replace(emojiRegexPattern, m => {
      // @ts-ignore
      return `[e-${m.codePointAt(0).toString(16)}]`
    })

    setMessages(s => {
      const comment: Comment = {
        id: faker.datatype.uuid(),
        text: text,
        type: 'text',
        created: dayjs().format(),
        likes: 0,
        user: {
          id: user.id,
          firstName: user?.firstName || faker.name.firstName(),
          lastName: user?.firstName || faker.name.lastName(),
          username: user?.username,
          avatarUrl: user?.avatarUrl || faker.image.avatar(),
        },
      }
      return [...s!, comment]
    })
    postComment.mutate({
      type: 'text',
      ref: [videoId, replyId],
      text: emojiSafeText,
      resourceType: 'video',
    })
    scrollToBottom()
  }

  const handleRepliesPress = (id: string) => {
    Keyboard.dismiss()
    onRepliesPress(id)
  }
  /** Media Picker Methods */

  const handleMediaPicked = (response: ImagePickerResponse) => {
    if (response.type === 'image/jpg' || response.type === 'image/jpeg') {
      addMediaMessage({ type: 'image', imageUrl: response.uri })
    } else {
      addMediaMessage({ type: 'video', videoUrl: response.uri })
    }
    uploadMedia(createFormData(response))
  }

  const addMediaMessage = (data: CommentOptions) => {
    setMessages(s => {
      const comment: Comment = {
        id: faker.datatype.uuid(),
        text: data.text,
        type: data.type,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        created: dayjs().format(),
        likes: 0,
        user: {
          id: user.id,
          firstName: user?.firstName || faker.name.firstName(),
          lastName: user?.firstName || faker.name.lastName(),
          username: user?.username,
          avatarUrl: user?.avatarUrl || faker.image.avatar(),
        },
      }
      return [...s!, comment]
    })
  }

  const uploadMedia = async (data: FormData) => {
    if (data) {
      const res = await upload.mutateAsync(data)
      if (res) {
        const { file } = res
        postComment.mutate({
          resourceType: 'video',
          ref: [videoId],
          type: file.type,
          imageUrl: file.image_url,
          videoUrl: file.video_url,
          height: file.height,
          width: file.width,
          aspectRatio: file.aspect_ratio,
        })
      }
    }
  }

  const handleMediaPress = () => {
    setShowMediaPicker(v => !v)
    Keyboard.dismiss()
  }

  const orderMessages = React.useMemo(
    () => orderBy(messages, item => new Date(item.created), 'asc'),
    [messages]
  )
  /** Render Methods */

  const renderCommentList = (
    <CommentsList
      userId={user?.id}
      ref={flatlistRef as any}
      items={orderMessages || []}
      isShowing={isShowing}
      onRepliesPress={handleRepliesPress}
      onCommentPlay={onCommentPlay}
      onReportComment={onReportComment}
      commentingEnabled={commentingEnabled}
      onCommentLike={handleCommentLike}
      onCommentReply={handleCommentReply}
    />
  )

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <>
        <Wrapper>
          <Container>
            <CommentsHeader
              title={i18n.t('comments_title')}
              onBackPress={() => {
                Keyboard.dismiss()
                onBackPress?.()
              }}
            />
            {renderCommentList}
            {commentingEnabled && messages && (
              <CommentsInput
                onActionPress={handleMediaPress}
                onSendPress={handleCommentSend}
                replyValue={replyValue}
                onFocus={scrollToBottom}
                onBlur={scrollToBottom}
              />
            )}
          </Container>
        </Wrapper>
        <MediaPicker
          isVisible={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onPick={handleMediaPicked}
        />
      </>
    </TouchableWithoutFeedback>
  )
}

const Wrapper = styled.SafeAreaView`
  ${tw(`flex-1 bg-black bg-opacity-75`)}
  width: ${k.screen.w}px;
  height: ${k.isAndroid && StatusBar.currentHeight
    ? k.screen.h + StatusBar.currentHeight
    : k.screen.h}px;
`
const Container = styled.View`
  ${tw(`flex-1`)}
`
