import * as React from 'react'
import { ListRenderItem, StatusBar } from 'react-native'
import styled from 'styled-components/native'
import tw from 'tailwind-rn'
import Spinner from 'react-native-spinkit'
import { FlatList } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { orderBy } from 'lodash-es'
// import { useTranslation } from '@/providers/TranslationProvider'

import * as k from '@/utils/constants'

import { Comment } from '@/hooks'
import { CommentsHeader } from '../comment/comments-header.component'
import { CommentsMessage } from '../comment/comments-message.component'

interface Props {
  userId: string
  onBackPress: () => void
  items: Comment[]
  onRepliesCommentLike: (id: string, isLiked: boolean) => void
  onRepliesCommentReport: (id: string) => void
  commentingEnabled: boolean
}

export const VideoReplies = ({
  userId,
  onBackPress,
  items,
  onRepliesCommentLike,
  onRepliesCommentReport,
  commentingEnabled,
}: Props) => {
  // const i18n = useTranslation()
  const insets = useSafeAreaInsets()

  const orderMessages = React.useMemo(
    () => orderBy(items, item => new Date(item.created), 'asc'),
    [items]
  )

  const listStyle = React.useMemo(
    () => ({
      paddingHorizontal: 16,
      marginBottom: insets.bottom,
      paddingTop: 16,
    }),
    [insets]
  )

  const renderItem = React.useCallback<ListRenderItem<Comment>>(
    ({ item }) => {
      return (
        <CommentsMessage
          key={item.id}
          item={item}
          onCommentLike={onRepliesCommentLike}
          userId={userId}
          isReplies={commentingEnabled}
          onReport={onRepliesCommentReport}
        />
      )
    },
    [onRepliesCommentLike, userId, onRepliesCommentReport, commentingEnabled]
  )

  return (
    <Wrapper>
      <Container>
        <CommentsHeader title="Replies" onBackPress={onBackPress} />
        {!items ||
          (items.length === 0 && (
            <SpinnerWrapper>
              <Spinner type="Pulse" size={100} color="white" />
            </SpinnerWrapper>
          ))}
        {items && items.length > 0 && (
          <FlatList
            data={orderMessages}
            renderItem={renderItem}
            style={listStyle}
          />
        )}
      </Container>
    </Wrapper>
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
const SpinnerWrapper = styled.View`
  ${tw(`flex-1 items-center justify-center`)}
`
